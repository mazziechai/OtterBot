// Copyright (C) 2021 mazziechai
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

const fs = require("fs");
const { Collection } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId, token } = require("../../config.json");
const { logger } = require("../logger");

module.exports = {
    load_commands(client) {
        logger.info("Loading commands...");

        const commandFiles = fs
            .readdirSync("./src/commands")
            .filter((file) => file.endsWith(".js"));

        logger.info(`Command files found: ${commandFiles}`);

        if (client.commands === undefined) {
            logger.debug("client.commands is undefined, creating a new one");
            client.commands = new Collection();
        } else {
            logger.debug(
                "Attempting to delete the require cache for all currently loaded commands"
            );

            for (const command of commandFiles) {
                delete require.cache[require.resolve(`../commands/${command}`)];
            }
        }

        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            client.commands.set(command.data.name, command);
            logger.info(`Loaded command ${command.data.name}!`);
        }
    },

    deploy_commands() {
        const commands = [];
        const commandFiles = fs
            .readdirSync("./src/commands")
            .filter((file) => file.endsWith(".js"));

        // Getting the json of each command's exported data
        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            commands.push(command.data.toJSON());
        }

        const rest = new REST({ version: "9" }).setToken(token);

        (async () => {
            try {
                logger.info("Started deploying application commands.");

                // Actually deploying the commands now
                await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId),
                    {
                        body: commands
                    }
                );

                logger.info("Successfully deployed application commands.");
            } catch (error) {
                logger.error(error);
            }
        })();
    }
};

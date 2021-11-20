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

const { Client, Intents } = require("discord.js");
const { logger } = require("./logger");
const { token } = require("../config.json");
const { load_commands, deploy_commands } = require("./utils/command");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

load_commands(client);
deploy_commands();

client.once("ready", () => {
    logger.info(`Logged in as ${client.user.username}`);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true
        });
    }
});

client.login(token);

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

const { SlashCommandBuilder } = require("@discordjs/builders");
const { deploy_commands } = require("../utils/command");
const { logger } = require("../logger");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deploy")
        .setDescription("Deploys commands."),
    async execute(interaction) {
        if (interaction.member.id === "712104395747098656") {
            deploy_commands();
            await interaction
                .reply("Successfully deployed commands!")
                .catch(logger.error);
        } else {
            await interaction
                .reply({
                    content: "This command isn't for you!",
                    ephemeral: true
                })
                .catch(logger.error);
        }
    }
};

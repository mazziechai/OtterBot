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
const { logger } = require("../logger");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("roll")
        .setDescription("Rolls dice of any number or sides.")
        .addStringOption((option) =>
            option
                .setName("xdy")
                .setDescription(
                    "Enter a dice roll in RPG format. Example: 2d20-3"
                )
                .setRequired(true)
        ),
    async execute(interaction) {
        const roll = interaction.options.getString("xdy");

        // Test if the string supplied by the user is in XdY format
        if (!/\d+(d)\d+([-+]\d+)?/g.test(roll)) {
            await interaction
                .reply({
                    content: "That's not a valid dice roll!",
                    ephemeral: true
                })
                .catch(logger.error);
            return;
        }

        // Split the number and faces into separate variables
        const [number, faces, modifier] = roll.split(/[d+-]/g);

        if ((number == 0) | (faces == 0) | (modifier == 0)) {
            await interaction
                .reply({
                    content: "That's not a valid dice roll!",
                    ephemeral: true
                })
                .catch(logger.error);
            return;
        }

        // Calculate all the results

        const modIsNegative = /[-]/g.test(roll);

        const results = Array(parseInt(number))
            .fill()
            .map(() => Math.floor(Math.random() * faces + 1));

        const result = results.reduce(function (x, y) {
            return x + y;
        });

        const numberAdditionStr = results.join(" + ") + ` = ${result}`;
        const modifierStr =
            modifier !== undefined ? (modIsNegative ? " -" : " +") : "";
        const modTotalStr =
            modifier !== undefined
                ? ` ${modifier} = ${
                      modIsNegative
                          ? result - parseInt(modifier)
                          : result + parseInt(modifier)
                  }`
                : "";
        const rollMsg = numberAdditionStr + modifierStr + modTotalStr;

        await interaction
            .reply(
                `${
                    interaction.inGuild
                        ? interaction.member.nickname
                        : interaction.user.username
                } rolled \`${roll}\` and got **${rollMsg}**.`
            )
            .catch(logger.error);
    }
};

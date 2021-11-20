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

const { pino } = require("pino");
const { loggingLevel } = require("../config.json");

const dest = pino.destination({ sync: false });
const logger = pino(dest);

logger.level = loggingLevel;

// asynchronously flush every 10 seconds to keep the buffer empty
// in periods of low activity
setInterval(function () {
    logger.flush();
}, 10000).unref();

module.exports = {
    logger: logger
};

const config = require("config");

module.exports = function () {
    if (!config.get("jwtkey")) {
        throw new Error("FATAL ERROR: jwtkey is not defined ");
        process.exit(1);
      }
}
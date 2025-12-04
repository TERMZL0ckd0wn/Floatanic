const { db } = require("../handlers/db.js");
const config = require("../config.json");
const { v4: uuidv4 } = require("uuid");
const log = new (require("cat-loggr"))();

async function init() {
  const floatanic = await db.get("floatanic_instance");
  if (!floatanic) {
    log.init("First run detected. Welcome!");
    log.init(
      "Use the skyport.dev documentation because code is still based on it.",
    );

    const errorMessages = [];

    let imageCheck = await db.get("images");
    let userCheck = await db.get("users");

    if (!imageCheck) {
      errorMessages.push("Can't find images for running instances...");
      errorMessages.push("Please run: npm run seed");
    }

    if (!userCheck) {
      errorMessages.push("No user detected...");
      errorMessages.push("Please create one using: npm run createUser ");
    }

    if (errorMessages.length > 0) {
      errorMessages.forEach((errorMsg) => log.error(errorMsg));
      process.exit();
    }

    const floatanicId = uuidv4();
    const setupTime = Date.now();

    const info = {
      floatanicId: floatanicId,
      setupTime: setupTime,
      originalVersion: config.version,
    };

    await db.set("floatanic_instance", info);
    log.info("Floatanic panel ID: " + floatanicId);
  }
  log.info("Init complete!");
}

module.exports = { init };

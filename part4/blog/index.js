const app = require("./app");
const config = require("./utils/config");
const logger = require("./utils/logger");

const activePORT = config.PORT || 8080;

app.listen(activePORT, () => {
  logger.info(`Server running on port ${activePORT}`);
});

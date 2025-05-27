import app from "@app";
import config from "@config/index";
import { SERVER_MESSAGES } from "@utils/constants";

const { host, port } = config;
const { runningOn } = SERVER_MESSAGES;

app.listen(config.port, () => console.log(`${runningOn} ${host}:${port}`));

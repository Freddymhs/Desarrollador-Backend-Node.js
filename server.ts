import { createServer } from "http";
import app from "@app";
import config from "@config/index";
import { SERVER_MESSAGES } from "@utils/constants";
import { createSocketServer } from "socketSetup";

const { host, port } = config;
const { runningOn } = SERVER_MESSAGES;

const server = createServer(app);
createSocketServer(server, app);

server.listen(port, () => {
  console.log(`${runningOn} ${host}:${port}`);
});

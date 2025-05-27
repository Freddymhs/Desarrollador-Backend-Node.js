import app from "@/app";
import { config } from "@/config/index";
import { SERVER_MESSAGES } from "@/utils/constants";

app.listen(config.port, () =>
  console.log(`${SERVER_MESSAGES.runningOn} ${config.host}:${config.port}`)
);

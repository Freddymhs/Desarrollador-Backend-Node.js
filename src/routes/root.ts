import { Router, Request, Response } from "express";
import { SERVER_MESSAGES } from "@utils/constants";

const routes = Router();
const { apiIsRunning } = SERVER_MESSAGES;

routes.get("/", (_req: Request, res: Response) => {
  res.send(`
    <html>
      <head>
        <title>${apiIsRunning}</title>
      </head>
      <body >
        <h1>✅</h1>
        <p>Visita la <a href="/docs">documentación</a> para más detalles.</p>
      </body>
    </html>
  `);
});

export default routes;

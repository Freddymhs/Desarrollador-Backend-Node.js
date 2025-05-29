import { Router, Request, Response, NextFunction } from "express";
import { SERVER_MESSAGES } from "@utils/constants";

const routes = Router();
const { unknownError, apiIsRunning } = SERVER_MESSAGES;

// routes.get("/", (_req: Request, res: Response) => {
//   res.send(apiIsRunning);
// });
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

routes.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: unknownError });
});

export default routes;

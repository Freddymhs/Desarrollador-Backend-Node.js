import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { Express } from "express";
import config from "@config/index";

export const createSocketServer = (httpServer: HttpServer, app: Express) => {
  const newSocketServer = new Server(httpServer, {
    cors: {
      origin: config.cors.origin,
      methods: config.cors.methods,
      credentials: config.cors.credentials,
    },
  });

  app.locals.io = newSocketServer;
  connectionsInSocketServer(newSocketServer);
};

export const connectionsInSocketServer = (socketServer: Server) => {
  socketServer.on("connection", (clientSocket) => {
    console.log("conectado:", clientSocket.id);

    clientSocket.on("disconnect", () => {
      console.log("desconectado:", clientSocket.id);
    });
  });
};

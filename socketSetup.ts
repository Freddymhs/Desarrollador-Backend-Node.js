import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { Express } from "express";

export const createSocketServer = (httpServer: HttpServer, app: Express) => {
  const newSocketServer = new Server(httpServer, {
    // transports: ["websocket"], // forzar WebSocket
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
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

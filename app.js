import express from "express";
import dotenv from "dotenv";
import { config } from "./src/config/config.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { ACTIONS } from "./src/utils/Actions.js";
dotenv.config();
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [config.get("frontend_domain")],
    methods: ["GET", "POST"],
  },
});
console.log("here is your frontend domain", config.get("frontend_domain"));

const userSocketMap = {};

function getAllConnectedClient(roomId) {
  //Map
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log("Socket is connected: ", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    //store this in redis
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClient(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("joined", {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });
  //listening to code in others text editor

  socket.on("code-change", ({ roomId, code }) => {
    socket.in(roomId).emit("code-change", { code });
  });

  socket.on("sync-code", ({ socketId, code }) => {
    io.to(socketId).emit("code-change", { code });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit("disconnected", {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});

httpServer.listen(config.get("port"), () => {
  console.log(`⚙️ Server is running at port: ${config.get("port")}`);
});

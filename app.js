import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { config } from "./src/config/config.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { ACTIONS } from "./src/utils/Actions.js";
import { exec } from "child_process";
import twilio from "twilio";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: config.get("frontend_domain"),
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Authorization,Content-Type",
  })
);

app.use(express.json());

const twilioClient = twilio(config.get("sms_sid"), config.get("sms_authtoken"));

app.post("/send-sms", (req, res) => {
  const { phoneNo, message } = req.body;
  twilioClient.messages
    .create({
      body: message,
      from: config.get("smsfromnumber"),
      to: phoneNo,
    })
    .then((message) => {
      res.status(200).json({ success: true, message: message.sid });
    })
    .catch((error) => {
      res.status(500).json({ success: false, error: error.message });
    });
});

app.post("/run-code", (req, res) => {
  const { code } = req.body;
  exec(`node -e "${code.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
    if (error) {
      return res.status(400).json({
        success: false,
        output: stderr || error.message,
      });
    }
    res.status(200).json({
      success: true,
      output: stdout.trim(),
    });
  });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"], // Set explicitly to your frontend URL
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

function getAllConnectedClient(roomId) {
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

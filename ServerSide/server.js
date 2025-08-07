import express from "express";
import http from 'http';
import { Server } from 'socket.io';
import Router from "./router.js";
import connection from "./connection.js";
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const server = http.createServer(app); // ✅ create server manually
const io = new Server(server, {
  cors: {
    origin: '*', // adjust if needed
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use('/api', Router);

// Socket.io events
io.on("connection", (socket) => {
  console.log("🟢 A user connected", socket.id);

  socket.on("send_message", (data) => {
    // Broadcast the message to the room
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected", socket.id);
  });
});

connection().then(() => {
  server.listen(process.env.PORT, () => {
    console.log(`🚀 Server started at http://localhost:${process.env.PORT}`);
  });
}).catch((error) => {
  console.log(error);
});

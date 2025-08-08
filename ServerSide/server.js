import express from "express";
import http from 'http';
import { Server } from 'socket.io';
import Router from "./router.js";
import connection from "./connection.js";
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use('/api', Router);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST']
  }
});

io.on("connection", (socket) => {
  console.log("🟢 A user connected", socket.id);

  socket.on("send_message", (data) => {
    io.emit("receive_message", data); 
  });

  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected", socket.id);
  });
});

connection()
  .then(() => {
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      console.log(`🚀 Server started at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to DB:', error);
  });

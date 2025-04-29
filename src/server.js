import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import router from "./routes/index.js";
import { config } from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
const app = express();

config();

const PORT = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.use(
  cors({
    origin: '*', // Allow all origins
  })
);

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins (update for production)
    methods: ['GET', 'POST'],
  },
});

app.use("/api/", router);

app.use((req, res, next) => {
  req.io = io; // Attach io instance to the request
  next();
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});
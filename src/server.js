import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import router from "./routes/index.js";
import { config } from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
const app = express();

config();

const PORT = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.use(
  cors({
    origin: '*', 
  })
);

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'],
  },
});

app.use("/api/", router);

app.use((req, res, next) => {
  req.io = io; 
  next();
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  const token = socket.handshake.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userRole = decoded.role; 
      console.log(`User role registered: ${socket.userRole}`);
    } catch (error) {
      console.error('Invalid token:', error);
    }
  } else {
    console.log('No token provided for socket connection');
  }

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});
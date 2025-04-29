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

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log(`Connected to server with id: ${socket.id}`);
});

socket.on("server-message", (message) => {
  console.log(`server says: ${message}`);
});

socket.emit("widget-message", "hello from widget");

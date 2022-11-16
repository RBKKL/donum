import "./styles.css";
import { io } from "socket.io-client";

const params = new URLSearchParams(window.location.search);
const address = params.get("address");
if (!address) {
  throw new Error("No address provided");
}

const socket = io("http://localhost:8000", {
  auth: {
    address,
  },
});

socket.on("connect", () => {
  console.log(`Connected to server with id: ${socket.id}`);
});

socket.on("new-donation", (donation) => {
  console.log(`new donation: ${JSON.stringify(donation)}`);
});

import Fastify from "fastify";
import socketioServer from "fastify-socket.io";
import cors from "@fastify/cors";

const app = Fastify({ logger: true });
app.register(cors, {
  origin: "*",
  methods: "GET,POST,PUT,PATCH,DELETE",
  allowedHeaders: "*",
});
app.register(socketioServer, {
  cors: {
    origin: "*",
    methods: "GET,POST,PUT,PATCH,DELETE",
    allowedHeaders: "*",
  },
});

app.ready((err) => {
  if (err) throw err;

  app.io.on("connection", (socket) => {
    app.log.info("a user connected with id: ", socket.id);

    socket.on("widget-message", (message) => {
      app.log.info(`widget says: ${message}`);
    });

    socket.emit("server-message", "hello from server");
  });
});

app.listen({ port: 8000 }, (err, address) => {
  if (err) throw err;
  app.log.info(`server listening on ${address}`);
});

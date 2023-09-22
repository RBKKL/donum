import corsPlugin from "@fastify/cors";
import Fastify from "fastify";
import socketioServer from "fastify-socket.io";
import { BiMap } from "mnemonist";
import superJSON from "superjson";
import { castToDonationObject } from "@donum/contracts/helpers";
import { NewDonationEvent as NewDonationContractEvent } from "@donum/contracts/types/DonationsStore";
import type {
  ChangeSettingsEvent,
  NewDonationEvent,
} from "@donum/shared/events";
import { apiClient } from "./api-client";
import { DonationsStoreContract } from "./donations-store-contract";
import { env } from "./env";

const clients = new BiMap<string, string>(); // address <-> socketId

const logDonationMsg = (donation: NewDonationContractEvent.OutputObject) => {
  return `New donation: ${superJSON.serialize(donation).json}`;
};

const app = Fastify({ logger: true });
const cors = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: "*",
};
app.register(corsPlugin, cors);
app.register(socketioServer, { cors });

app.ready((err) => {
  if (err) {
    app.log.error(`Got error on app.ready: ${err}`);
    throw err;
  }

  app.io.on("connection", async (socket) => {
    const address = socket.handshake.auth.address; // ethereum address
    app.log.info(`Client with id: ${socket.id}, address: ${address} connected`);
    clients.set(address, socket.id);

    socket.on("disconnect", () => {
      app.log.info(`Client with id: ${socket.id} disconnected`);
      clients.inverse.delete(socket.id);
    });

    const notificationSettings =
      await apiClient.profile.getNotificationSettings.query({
        address,
      });

    app.io.to(socket.id).emit("changeSettings", notificationSettings);
  });
});

const emitNewDonationEvent = async (
  donation: NewDonationContractEvent.OutputObject
) => {
  app.log.info(logDonationMsg(donation));

  const socketId = clients.get(donation.to);
  if (!socketId) {
    app.log.warn(`Client with address ${donation.to} not connected`);
    return;
  }

  // TODO: optimize this
  const minShowAmount = await apiClient.profile.getMinShowAmount.query({
    address: donation.to,
  });

  if (donation.amount >= minShowAmount) {
    app.io.to(socketId).emit("newDonation", {
      from: donation.from,
      nickname: donation.nickname,
      message: donation.message,
      amount: donation.amount.toString(),
    });
  }
};

app.post("/test", (req, res) => {
  if (req.headers.authorization !== env.EVENTS_SERVER_AUTH_TOKEN) {
    res.status(403).send("Wrong secret");
    return;
  }

  const testDonation = superJSON.parse<NewDonationEvent>(req.body as string);
  emitNewDonationEvent({
    ...testDonation.data,
    to: testDonation.to,
    from: "", // dummy value for test donation
    amount: BigInt(testDonation.data.amount),
    timestamp: BigInt(Date.now()) / 1000n, // convert ms to s (real timestamp is in seconds)
  });
  res.status(200).send();
});

app.post("/change-settings", async (req, res) => {
  if (req.headers.authorization !== env.EVENTS_SERVER_AUTH_TOKEN) {
    res.status(403).send("Wrong secret");
    return;
  }

  const { to, data } = superJSON.parse<ChangeSettingsEvent>(req.body as string);

  const clientSocketId = clients.get(to);
  if (!clientSocketId) {
    res.status(404).send("Client not found");
    return;
  }

  app.io.to(clientSocketId).emit("changeSettings", data);
  res.status(200).send();
});

DonationsStoreContract.on(
  DonationsStoreContract.filters.NewDonation,
  (...donationArray) => {
    const donation = castToDonationObject(donationArray);
    emitNewDonationEvent(donation);
  }
);

const start = async () => {
  try {
    await app.listen({
      host: env.EVENTS_SERVER_HOST,
      port: env.PORT,
    });
  } catch (err) {
    app.log.error(`Got error on app.listen: ${err}`);
    process.exit(1);
  }
};
start();

import Fastify from "fastify";
import socketioServer from "fastify-socket.io";
import corsPlugin from "@fastify/cors";
import { BiMap } from "mnemonist";
import type { NewDonationEvent } from "@donum/contracts/types/DonationsStore";
import { castToDonationObject } from "@donum/contracts/helpers";
import { DonationsStoreContract } from "./donations-store-contract";
import { toDonationObjectForWidget } from "./utils";
import { prisma } from "@donum/prisma";
import { BigNumber } from "ethers";
import { DEFAULT_SHOW_AMOUNT } from "@donum/shared/constants";

const clients = new BiMap<string, string>(); // address <-> socketId

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

  app.io.on("connection", (socket) => {
    app.log.info(
      `Connected to server with id: ${socket.id}, address: ${socket.handshake.auth.address}`
    );
    clients.set(socket.handshake.auth.address, socket.id);
    socket.on("disconnect", () => {
      app.log.info(`Client with id: ${socket.id} disconnected`);
      clients.inverse.delete(socket.id);
    });
  });
});

DonationsStoreContract.on<NewDonationEvent>(
  DonationsStoreContract.filters.NewDonation(),
  async (...donationArray) => {
    const donation = castToDonationObject(donationArray);
    app.log.info(`New donation: ${JSON.stringify(donation)}`);
    const socketId = clients.get(donation.to);
    const profile = await prisma.profile.findFirst({
      where: { address: donation.to },
    });

    if (
      socketId &&
      donation.amount.gte(
        BigNumber.from(profile?.minShowAmount.toString() ?? DEFAULT_SHOW_AMOUNT)
      )
    ) {
      app.io
        .to(socketId)
        .emit("new-donation", toDonationObjectForWidget(donation));
    }
  }
);

const start = async () => {
  try {
    await app.listen({ port: 8000 });
  } catch (err) {
    app.log.error(`Got error on app.listen: ${err}`);
    process.exit(1);
  }
};
start();

import Fastify from "fastify";
import socketioServer from "fastify-socket.io";
import corsPlugin from "@fastify/cors";
import { BiMap } from "mnemonist";
import type {
  ChallengeProposedEvent,
  ChallengeProposedEventObject,
  NewDonationEvent,
  NewDonationEventObject,
} from "@donum/contracts/types/DonationsStore";
import {
  castToProposedChallengeObject,
  castToDonationObject,
} from "@donum/contracts/helpers";
import { DonationsStoreContract } from "./donations-store-contract";
import {
  toProposalChallengeForWidget,
  toDonationObjectForWidget,
} from "./utils";
import { prisma } from "@donum/prisma";
import { BigNumber } from "ethers";
import { DEFAULT_SHOW_AMOUNT } from "@donum/shared/constants";
import { env } from "./env";

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

  app.io.on("connection", async (socket) => {
    app.log.info(
      `Connected to server with id: ${socket.id}, address: ${socket.handshake.auth.address}`
    );
    clients.set(socket.handshake.auth.address, socket.id);

    const profile = await prisma.profile.findFirst({
      where: { address: socket.handshake.auth.address }, // TODO: add authentification
    });
    app.io
      .to(socket.id)
      .emit(
        "change-settings",
        profile?.notificationImageUrl,
        profile?.notificationSoundUrl,
        profile?.notificationDuration
      );

    socket.on("disconnect", () => {
      app.log.info(`Client with id: ${socket.id} disconnected`);
      clients.inverse.delete(socket.id);
    });
  });
});

const emitChallengeProposedEvent = async (
  challenge: ChallengeProposedEventObject
) => {
  app.log.info(`New challenge: ${JSON.stringify(challenge)}`);
  const socketId = clients.get(challenge.to);
  const profile = await prisma.profile.findFirst({
    where: { address: challenge.to },
  });

  const minShowAmount = BigNumber.from(
    profile?.minShowAmount?.toString() || DEFAULT_SHOW_AMOUNT
  );
  console.log("minShowAmount", minShowAmount.toString());
  console.log("donation.amount", challenge.proposalPrice.toString());

  if (socketId && challenge.proposalPrice.gte(minShowAmount)) {
    console.log(toProposalChallengeForWidget(challenge));
    app.io
      .to(socketId)
      .emit("challenge-proposal", toProposalChallengeForWidget(challenge));
  }
};

const emitNewDonationEvent = async (donation: NewDonationEventObject) => {
  app.log.info(`New donation: ${JSON.stringify(donation)}`);
  const socketId = clients.get(donation.to);
  const profile = await prisma.profile.findFirst({
    where: { address: donation.to },
  });

  const minShowAmount = BigNumber.from(
    profile?.minShowAmount?.toString() || DEFAULT_SHOW_AMOUNT
  );
  console.log("minShowAmount", minShowAmount.toString());
  console.log("donation.amount", donation.amount.toString());

  if (socketId && donation.amount.gte(minShowAmount)) {
    app.io
      .to(socketId)
      .emit("new-donation", toDonationObjectForWidget(donation));
  }
};

app.post("/test", (req, res) => {
  if (req.headers.authorization !== env.EVENTS_SERVER_AUTH_TOKEN) {
    res.status(403).send("Wrong secret");
    return;
  }
  const testDonation = JSON.parse(req.body as string);

  emitNewDonationEvent({
    ...testDonation,
    amount: BigNumber.from(testDonation.amount),
  });
  res.status(200).send();
});

app.post("/change-settings", async (req, res) => {
  if (req.headers.authorization !== env.EVENTS_SERVER_AUTH_TOKEN) {
    res.status(403).send("Wrong secret");
    return;
  }
  const {
    address,
    notificationImageUrl,
    notificationSoundUrl,
    notificationDuration,
  } = JSON.parse(req.body as string);

  const clientSocketId = clients.get(address);
  clientSocketId &&
    app.io
      .to(clientSocketId)
      .emit(
        "change-settings",
        notificationImageUrl,
        notificationSoundUrl,
        notificationDuration
      );

  res.status(200).send();
});

DonationsStoreContract.on<NewDonationEvent>(
  DonationsStoreContract.filters.NewDonation(),
  (...donationArray) => {
    const donation = castToDonationObject(donationArray);
    emitNewDonationEvent(donation);
  }
);

DonationsStoreContract.on<ChallengeProposedEvent>(
  DonationsStoreContract.filters.ChallengeProposed(),
  (...challengeArray) => {
    const challenge = castToProposedChallengeObject(challengeArray);
    emitChallengeProposedEvent(challenge);
  }
);

// DonationsStoreContract.on<ChallengeFailedEvent>(
//   DonationsStoreContract.filters.ChallengeFailed(),
//   (...challengeArray) => {
//     const challenge = castToFailedChallengeObject(challengeArray);
//     const socketId = clients.get(challenge.to);
//     if (socketId) {
//       app.io.to(socketId).emit("challenge-failed", challenge.id);
//     }
//   }
// );

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

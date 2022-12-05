import { expect } from "chai";
import { ethers } from "hardhat";
import { CONTRACT_NAME } from "@donum/shared/constants";
import { DonationsStore } from "../types";

describe(CONTRACT_NAME, async () => {
  let donationsStore: DonationsStore;

  const generateString = (length: number) => {
    let result = "";
    const characters =
      "абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ0123456789";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  };

  const makeDonation = async (options?: {
    nickname?: string;
    message?: string;
  }) => {
    const [owner, sender, recipient] = await ethers.getSigners();
    const amount = ethers.utils.parseEther("0.1");
    const nickname = options?.nickname ?? generateString(64);
    const message = options?.message ?? generateString(256);

    const txn = await donationsStore
      .connect(sender)
      .donate(nickname, recipient.address, message, {
        value: amount,
      });

    return { txn, owner, sender, nickname, recipient, amount, message };
  };

  beforeEach(async () => {
    const [owner] = await ethers.getSigners();
    const contractFactory = await ethers.getContractFactory(
      CONTRACT_NAME,
      owner
    );
    donationsStore = await contractFactory.deploy();
    await donationsStore.deployed();
  });

  it("Should emit donation event", async () => {
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp;
    const { txn, sender, nickname, recipient, amount, message } =
      await makeDonation();

    expect(txn)
      .to.emit(donationsStore, "NewDonation")
      .withArgs(sender, nickname, recipient, amount, timestampBefore, message);
  });

  it("Should payout donations to recipients", async () => {
    const { recipient, amount, txn } = await makeDonation();

    await expect(txn).to.changeEtherBalance(recipient, amount);
  });

  it("Should handle empty nickname", async () => {
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp;
    const nickname = "";
    const { txn, sender, recipient, amount, message } = await makeDonation({
      nickname,
    });

    expect(txn)
      .to.emit(donationsStore, "NewDonation")
      .withArgs(sender, nickname, recipient, amount, timestampBefore, message);
  });
});

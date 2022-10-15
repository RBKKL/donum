import { expect } from "chai";
import { ethers } from "hardhat";
import { CONTRACT_NAME } from "@lib/constants";
import { DonationsStore } from "../typechain-types";

describe(CONTRACT_NAME, async () => {
  let contract: DonationsStore;

  const generateMessage = (length: number) => {
    let result = "";
    const characters =
      "абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ0123456789";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  };

  const makeDonation = async () => {
    const [owner, sender, recipient] = await ethers.getSigners();
    const amount = ethers.utils.parseEther("0.1");
    const message = generateMessage(256);

    const txn = await contract
      .connect(sender)
      .donate(recipient.address, message, {
        value: amount,
      });

    return { txn, owner, sender, recipient, amount, message };
  };

  beforeEach(async () => {
    const [owner] = await ethers.getSigners();
    const contractFactory = await ethers.getContractFactory(
      CONTRACT_NAME,
      owner
    );
    contract = await contractFactory.deploy();
    await contract.deployed();
  });

  it("Should accept money from donations", async () => {
    const { txn, amount } = await makeDonation();

    expect(txn).to.changeEtherBalance(contract.address, amount);
  });

  it("Should append donations to mapping", async () => {
    const { recipient, message } = await makeDonation();

    const donationsToRecipient = await contract.getDonation(
      recipient.address,
      0
    );

    expect(donationsToRecipient.message).to.equal(message);
  });

  it("Should payout donations to recipients", async () => {
    const { recipient, amount, txn } = await makeDonation();

    await expect(txn).to.changeEtherBalance(recipient, amount);
  });

  it("Should get all donations", async () => {
    const { recipient } = await makeDonation();
    await makeDonation();

    const donations = await contract
      .connect(recipient)
      .getAllDonations(recipient.address);
    expect(donations.length).to.equal(2);
  });

  it("Should get donations in right order", async () => {
    const { message: messageA, recipient } = await makeDonation();
    const { message: messageB } = await makeDonation();

    const donations = await contract.getAllDonations(recipient.address);
    expect(donations[0].message).to.equal(messageA);
    expect(donations[1].message).to.equal(messageB);
  });
});

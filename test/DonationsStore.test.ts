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
    const { recipient, amount } = await makeDonation();

    await expect(
      contract.connect(recipient).withdrawDonations()
    ).to.changeEtherBalance(recipient, amount);
  });

  it("Should set paid out donations to paid", async () => {
    const { recipient } = await makeDonation();
    await contract.connect(recipient).withdrawDonations();

    const unpaidAmount = await contract.getUnpaidAmount(recipient.address);

    expect(unpaidAmount).to.equal(0);
    // TODO: add more assertions
  });

  it("Should payout donations only to recipients", async () => {
    const { sender } = await makeDonation();

    expect(await contract.connect(sender).withdrawDonations()).to.be.reverted;
  });
});

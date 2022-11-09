import { expect } from "chai";
import { ethers } from "hardhat";
import { CONTRACT_NAME } from "shared/constants";
import { DonationsStore } from "../typechain-types";

describe(CONTRACT_NAME, async () => {
  let donationsStore: DonationsStore;

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

    const txn = await donationsStore
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
    donationsStore = await contractFactory.deploy();
    await donationsStore.deployed();
  });

  it("Should emit donation event", async () => {
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp;
    const { txn, sender, recipient, amount, message } = await makeDonation();

    expect(txn)
      .to.emit(donationsStore, "NewDonation")
      .withArgs(sender, recipient, amount, timestampBefore, message);
  });

  it("Should payout donations to recipients", async () => {
    const { recipient, amount, txn } = await makeDonation();

    await expect(txn).to.changeEtherBalance(recipient, amount);
  });

  it("Should set recipient info", async () => {
    const [, sender] = await ethers.getSigners();
    donationsStore = donationsStore.connect(sender);
    const nickname = "Nixjke";
    const avatarURI =
      "https://static-cdn.jtvnw.net/jtv_user_pictures/c8ff98b9-b235-47c1-8079-ad10f5099dc2-profile_image-70x70.png";

    await donationsStore.setRecipientInfo(nickname, avatarURI);

    const [storedNickname, storedAvatarURI] = await donationsStore.recipients(
      sender.address
    );

    expect(storedNickname).to.equal(nickname);
    expect(storedAvatarURI).to.equal(avatarURI);
  });
});

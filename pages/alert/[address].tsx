import { NextPage } from "next";
import { DonationAlert } from "@components/DonationAlert";
import { ethers } from "ethers";

const AlertPage: NextPage = () => (
  <DonationAlert
    src="/assets/images/default_avatar.gif"
    amount={ethers.utils.parseEther("0.001")}
    sender="0x5F...0aa3"
    message="100 процентов людей, сидящих в этом зале, не знают, кто я такой. И это хорошо. Это правильно. Год назад я жил на окраине Академа. В крохотном общежитии с тараканами, клопами и одинокой мышью в духовке, а моим соседом был татуировщик Саня из Северобайкальск"
  />
);

export default AlertPage;

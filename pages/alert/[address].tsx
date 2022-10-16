import { NextPage } from "next";
import { Alert } from "@components/Alert";

const AlertPage: NextPage = () => (
  <Alert
    imgSrc="/assets/images/default_avatar.gif"
    donateValue={0.001}
    senderAddress="0x5F...0aa3"
    message="100 процентов людей, сидящих в этом зале, не знают, кто я такой. И это хорошо. Это правильно. Год назад я жил на окраине Академа. В крохотном общежитии с тараканами, клопами и одинокой мышью в духовке, а моим соседом был татуировщик Саня из Северобайкальск"
  />
);

export default AlertPage;

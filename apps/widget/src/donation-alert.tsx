import { Component } from "solid-js";
import { formatAddress, formatTokenAmount } from "@donum/shared/helpers";
import { DonationImage } from "./donation-image";
import { DonationInfoWithMetadata } from "./types";
import "./donation-alert.css";

interface DonationAlertProps {
  donation: DonationInfoWithMetadata;
}

export const DonationAlert: Component<DonationAlertProps> = (props) => {
  console.log(props.donation);

  return (
    <div class="donation">
      <audio src={props.donation.soundSrc} autoplay />
      <DonationImage
        imageSrc={props.donation.imageSrc}
        imageType={props.donation.imageType}
      />
      <h1 class="donation__title">
        {props.donation.nickname || formatAddress(props.donation.from)} sent{" "}
        {formatTokenAmount(props.donation.amount)} ETH
      </h1>
      <p class="donation__message">{props.donation.message}</p>
    </div>
  );
};

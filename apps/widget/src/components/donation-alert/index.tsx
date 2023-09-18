import { Component } from "solid-js";
import { formatAddress, formatTokenAmount } from "@donum/shared/helpers";
import { DonationInfoWithMetadata } from "@/lib/types";
import { DonationImage } from "./image";
import "./index.css";

interface DonationAlertProps {
  donation: DonationInfoWithMetadata;
}

export const DonationAlert: Component<DonationAlertProps> = (props) => {
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

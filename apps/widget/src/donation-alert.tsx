import { Component } from "solid-js";
import { formatAddress, formatTokenAmount } from "@donum/shared/helpers";
import { DonationInfo } from "./types";
import "./donation-alert.css";

interface DonationAlertProps {
  donationInfo: DonationInfo;
  imageSrc: string;
  soundSrc: string;
}

export const DonationAlert: Component<DonationAlertProps> = (props) => (
  <div class="donation">
    <audio src={props.soundSrc} autoplay />
    <div class="donation__image-container">
      <img class="donation__image" src={props.imageSrc} />
    </div>
    <h1 class="donation__title">
      {formatAddress(props.donationInfo.from)} sent{" "}
      {formatTokenAmount(props.donationInfo.amount)} ETH
    </h1>
    <p class="donation__message">{props.donationInfo.message}</p>
  </div>
);

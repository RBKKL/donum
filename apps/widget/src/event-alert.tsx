import { Component } from "solid-js";
import { formatAddress, formatTokenAmount } from "@donum/shared/helpers";
import { DonationImage } from "./donation-image";
import { ChallengeInfoWithMetadata, DonationInfoWithMetadata } from "./types";
import "./donation-alert.css";

interface EventAlertProps {
  event: DonationInfoWithMetadata | ChallengeInfoWithMetadata;
}

export const EventAlert: Component<EventAlertProps> = (props) => {
  console.log(props.event);

  // TODO rename css
  return (
    <div class="donation">
      <audio src={props.event.soundSrc} autoplay />
      <DonationImage
        imageSrc={props.event.imageSrc}
        imageType={props.event.imageType}
      />
      <h1 class="donation__title">
        {props.event.nickname || formatAddress(props.event.from)} sent{" "}
        {formatTokenAmount(props.event.amount)} ETH
      </h1>
      <p class="donation__message">{props.event.message}</p>
      {props.event?.award && (
        <>
          <p class="donation__title">
            {" "}
            challenge award: {formatTokenAmount(props.event.award)} ETH
          </p>
          <p class="donation__title"> {props.event.status} </p>
        </>
      )}
    </div>
  );
};

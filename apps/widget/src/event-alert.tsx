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
    <div class="event">
      <audio src={props.event.soundSrc} autoplay />
      <DonationImage
        imageSrc={props.event.imageSrc}
        imageType={props.event.imageType}
      />
      <h1 class="event__title">
        {props.event.nickname || formatAddress(props.event.from)} sent{" "}
        {formatTokenAmount(props.event.amount)} ETH
      </h1>
      <p class="event__message">{props.event.message}</p>
      {"award" in props.event && props.event?.award && (
        <>
          <p class="event__award">
            {" "}
            challenge award: {formatTokenAmount(props.event.award)} ETH
          </p>
          {props.event.status === "proposed" ? (
            <p class="event__status" style={{ color: "rgb(234 179 8)" }}>
              {" "}
              New challenge!
            </p>
          ) : props.event.status === "completed" ? (
            <p class="event__status" style={{ color: "rgb(181,255,35)" }}>
              {" "}
              Challenge completed!
            </p>
          ) : (
            <p class="event__status" style={{ color: "rgb(220,20,60)" }}>
              {" "}
              Challenge failed!
            </p>
          )}
        </>
      )}
    </div>
  );
};

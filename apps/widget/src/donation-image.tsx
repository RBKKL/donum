import { Component, Match, Switch } from "solid-js";
import { DonationMetadata } from "./types";
import "./donation-alert.css";

type DonationImageProps = Pick<DonationMetadata, "imageSrc" | "imageType">;

export const DonationImage: Component<DonationImageProps> = (props) => {
  return (
    <div class="event__image-container">
      <Switch fallback={<div>Error: image can't be rendered</div>}>
        <Match when={props.imageType === "image"}>
          <img class="event__image" src={props.imageSrc} />
        </Match>
        <Match when={props.imageType === "video"}>
          <video
            class="event__image"
            src={props.imageSrc}
            autoplay
            muted
            loop
          />
        </Match>
      </Switch>
    </div>
  );
};

import { Component } from "solid-js";
import { DonationType } from "./types";
import "./donation.css";

interface DonationProps {
  donation: DonationType;
}

export const Donation: Component<DonationProps> = (props) => (
  <div class="donation">
    <audio
      src="http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3"
      autoplay
    />
    <div class="donation__image-container">
      <img
        class="donation__image"
        src="/assets/images/default_avatar.gif"
        alt="donation alert image"
      />
    </div>
    <h1 class="donation__title">
      {props.donation.from} sent {props.donation.amount} ETH
    </h1>
    <p class="donation__message">{props.donation.message}</p>
  </div>
);

import { Component } from "solid-js";

// TODO: change props to "from", "amount", "message"
interface DonationProps {
  donation: string;
}

export const Donation: Component<DonationProps> = (props) => {
  return (
    <div>
      <h1>Donation: {props.donation}</h1>
    </div>
  );
};

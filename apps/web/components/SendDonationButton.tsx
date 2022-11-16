import classNames from "classnames";
import { FC, ReactNode } from "react";
import { Button } from "@components/Button";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface SendDonationButtonProps {
  isSendButtonDisabled?: boolean;
  isConnectButton?: boolean;
  onSendButtonClick?: () => void;
}

export const SendDonationButton: FC<SendDonationButtonProps> = ({
  isSendButtonDisabled,
  isConnectButton,
  onSendButtonClick,
}) => {
  if (isConnectButton) {
    return <ConnectButton />;
  } else {
    return (
      <Button
        text="Send"
        disabled={isSendButtonDisabled}
        onClick={onSendButtonClick}
      />
    );
  }
};

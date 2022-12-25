import { StyledModal } from "@components/Modal";
import Image from "next/image";
import { Button } from "@components/Button";
import { FC } from "react";
import { Loader } from "./Loader";

interface DonationModalProps {
  isOpen: boolean;
  setIsOpen: (x: boolean) => void;
  isError: boolean;
  isLoading: boolean;
  donationAmount: string;
  nickname: string;
}

export const DonationModal: FC<DonationModalProps> = ({
  isOpen,
  setIsOpen,
  isError,
  isLoading,
  donationAmount,
  nickname,
}) => (
  <StyledModal
    isOpen={isOpen}
    close={() => setIsOpen(false)}
    title={isError ? "Error" : ""}
  >
    {isLoading ? (
      <div>
        <div className="mb-3 flex justify-center py-8">
          <Loader size={90} color="orange" />
        </div>
        <div className="flex w-full flex-col items-center">
          <p className="mb-1 text-lg font-semibold">Waiting for confirmation</p>
          <p className="mb-2 text-lg font-semibold">
            Donating {parseFloat(donationAmount)} ETH to {nickname}
          </p>
          <p className="mb-2 text-xs">
            Confirm this transaction in your wallet
          </p>
        </div>
      </div>
    ) : isError ? (
      <div>
        <div className="flex flex-col items-center justify-center py-8">
          <Image
            src="/warning.svg"
            width={90}
            height={90}
            alt="icon for error result"
          />
          <p className="mt-5 text-lg font-semibold">Transaction rejected</p>
        </div>
        <Button onClick={() => setIsOpen(false)} text="Dismiss" fullWidth />
      </div>
    ) : (
      <div>
        <div className="flex flex-col items-center justify-center py-8">
          <Image
            src="/arrow.svg"
            width={90}
            height={90}
            alt="icon for success result"
          />
          <p className="mt-5 text-lg font-semibold">Transaction submitted</p>
        </div>
        <Button onClick={() => setIsOpen(false)} text="Close" fullWidth />
      </div>
    )}
  </StyledModal>
);

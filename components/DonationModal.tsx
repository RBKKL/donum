import { StyledModal } from "@components/Modal";
import Image from "next/image";
import { Button } from "@components/Button";
import { FC } from "react";

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
}) =>
  <StyledModal
    isOpen={isOpen}
    close={() => setIsOpen(false)}
    title={isError ? "Error" : ""}
  >
    {isLoading ? (
      <div>
        <div className="flex py-8 justify-center mb-3">
          <Image className="animate-spin" src="/assets/svg/loader.svg" layout="fixed" width={90} height={90}/>
        </div>
        <div className="flex flex-col w-full items-center">
          <p className="mb-1 text-lg font-semibold">Waiting for confirmation</p>
          <p className="mb-2 text-lg font-semibold">Donating {donationAmount} ETH to {nickname}</p>
          <p className="mb-2 text-xs">Confirm this transaction in your wallet</p>
        </div>
      </div>
    ) : (
      isError ? (
        <div>
          <div className="flex flex-col py-8 justify-center items-center">
            <Image src="/assets/svg/warning.svg" layout="fixed" width={90} height={90}/>
            <p className="mt-5 text-lg font-semibold">Transaction rejected</p>
          </div>
          <Button
            onClick={() => setIsOpen(false)}
            text="Dismiss"
            fullWidth
          />
        </div>
      ) : (
        <div>
          <div className="flex flex-col py-8 justify-center items-center">
            <Image src="/assets/svg/arrow.svg" layout="fixed" width={90} height={90}/>
            <p className="mt-5 text-lg font-semibold">Transaction submitted</p>
          </div>
          <Button
            onClick={() => setIsOpen(false)}
            text="Close"
            fullWidth
          />
        </div>
      ))}
  </StyledModal>
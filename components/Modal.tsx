import Image from "next/image";
import Modal from 'react-modal';
import { FC, ReactNode } from "react";

interface StyledModalProps {
  title?: string;
  isOpen: boolean;
  close: () => void;
  children: ReactNode;
}

export const StyledModal: FC<StyledModalProps> = ({
  title,
  isOpen,
  close,
  children,
}) => {
  return <Modal
    overlayClassName="bg-black fixed inset-0 bg-opacity-50 flex justify-center items-center"
    className="h-fit w-fit border-0"
    isOpen={isOpen}
    onRequestClose={close}
  >
    <div className="bg-zinc-700 rounded-3xl p-4 w-96">
      <div className="flex justify-between mb-3">
        <p>{title}</p>
        <Image onClick={close} src="/assets/svg/cross.svg" layout="fixed" width={24} height={24} />
      </div>
      {children}
    </div>
  </Modal>
}
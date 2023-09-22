import { FC, ReactNode } from "react";
import Modal from "react-modal";
import { CrossIcon } from "./icons/CrossIcon";

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
  return (
    <Modal
      overlayClassName="bg-black fixed inset-0 bg-opacity-50 flex justify-center items-center"
      className="h-fit w-fit border-0"
      isOpen={isOpen}
      onRequestClose={close}
    >
      <div className="w-96 rounded-3xl bg-zinc-700 p-4">
        <div className="mb-3 flex justify-between">
          <p>{title}</p>
          <CrossIcon onClick={close} />
        </div>
        {children}
      </div>
    </Modal>
  );
};

"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { Trash2 } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onDelete: () => Promise<void> | void;
  isLoading: boolean;
  title: string;
  itemName: string;
  itemType: string;
  customMessage?: string;
}

const DeleteConfirmationModal = ({
  isOpen,
  onOpenChange,
  onDelete,
  isLoading,
  title,
  itemName,
  itemType,
  customMessage,
}: DeleteConfirmationModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        base: "bg-gray-900 text-white",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 border-b border-gray-800">
              {title}
            </ModalHeader>

            <ModalBody className="py-4">
              <p className="text-gray-300">
                Are you sure you want to delete the {itemType}
                <span className="font-semibold text-white">
                  &quot;{itemName}&quot;
                </span>
                ?
              </p>

              {customMessage ? (
                <p className="text-red-400 text-sm mt-2">{customMessage}</p>
              ) : (
                <p className="text-red-400 text-sm mt-2">
                  This action cannot be undone.
                </p>
              )}
            </ModalBody>

            <ModalFooter className="border-t border-gray-800">
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="danger"
                variant="solid"
                onPress={async () => {
                  await onDelete();
                  onClose();
                }}
                isLoading={isLoading}
                startContent={!isLoading && <Trash2 size={16} />}
              >
                Delete {itemType}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal;

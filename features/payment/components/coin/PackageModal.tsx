import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { Coins } from "lucide-react";
import React from "react";

function PackageModal({isOpen,onClose,isNewPackage,setCurrentPackage,currentPackage,handleSavePackage}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {isNewPackage ? "Add New Package" : "Edit Package"}
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  type="number"
                  label="Coin Amount"
                  placeholder="Enter coin amount"
                  value={currentPackage.coinAmount.toString()}
                  onChange={(e) =>
                    setCurrentPackage({
                      ...currentPackage,
                      coinAmount: Number(e.target.value),
                    })
                  }
                  startContent={<Coins className="w-4 h-4 text-yellow-500" />}
                  variant="bordered"
                />
                <Input
                  type="number"
                  label="Price (INR)"
                  placeholder="Enter price in INR"
                  value={currentPackage.priceInINR.toString()}
                  onChange={(e) =>
                    setCurrentPackage({
                      ...currentPackage,
                      priceInINR: Number(e.target.value),
                    })
                  }
                  startContent={
                    <span className="text-default-400 font-medium">₹</span>
                  }
                  variant="bordered"
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleSavePackage}
                isDisabled={
                  currentPackage.coinAmount <= 0 ||
                  currentPackage.priceInINR <= 0
                }
              >
                Save Package
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default PackageModal;

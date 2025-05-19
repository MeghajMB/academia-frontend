"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Feather } from "lucide-react";

export default function RedeemablePointsCard({
  setWalletData,
  redeemablePoints,
  redeemConversion,
}) {
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleRedeem = () => {
    setIsRedeeming(true);
    setTimeout(() => {
      setIsRedeeming(false);
      setShowModal(true);
      // In a real app, you would make an API call here
    }, 1500);
  };

  return (
    <>
      <Card
        className="h-full bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 border-purple-200 dark:border-purple-800/30"
        shadow="sm"
      >
        <CardHeader className="flex gap-3 pb-0">
          <div className="flex items-center text-purple-900 dark:text-purple-300">
            <Feather />
            <div className="px-1">
              <h4 className="text-lg font-medium">Redeemable Points</h4>
              <p className="text-sm text-purple-700 dark:text-purple-400">
                Convert to gold coins or special perks
              </p>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl font-bold text-purple-900 dark:text-purple-300">
              {redeemablePoints}
            </div>

            <div className="relative">
              <motion.div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-purple-300 dark:border-purple-500 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-white font-bold text-xs">REDEEM</span>
              </motion.div>
            </div>
          </div>

          <Button
            color="secondary"
            className="bg-purple-600 hover:bg-purple-700 text-white mt-6"
            onClick={handleRedeem}
            isLoading={isRedeeming}
            startContent={!isRedeeming && <Feather />}
          >
            Redeem
          </Button>
        </CardBody>
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="md">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Redeem Coins
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 gap-4 py-4">
              <div className="flex items-center justify-between p-4 border rounded-lg border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 6v12"></path>
                      <path d="M8 12h8"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Convert to Gold Coins</h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Rate: 1:{redeemConversion} (
                      {redeemablePoints * redeemConversion} Gold Coins)
                    </p>
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="light"
              onPress={() => setShowModal(false)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

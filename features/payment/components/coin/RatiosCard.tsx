import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { motion } from "framer-motion";
import { ArrowRightLeft, Coins, Edit, Save } from "lucide-react";
import React from "react";

function RatiosCard({
  editingRatios,
  handleSaveRatios,
  setEditingRatios,
  goldToINRRatio,
  setGoldToINRRatio,
  redeemCoinToGoldRatio,
  setRedeemCoinToGoldRatio,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1, duration: 0.4 }}
    >
      <Card className="bg-black shadow-xl">
        <CardHeader className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-purple-200" />
            <h2 className="text-xl font-semibold text-white">
              Exchange Ratios
            </h2>
          </div>
          <div className="flex gap-1">
            <Button
              color={editingRatios ? "success" : "primary"}
              variant="shadow"
              startContent={
                editingRatios ? (
                  <Save className="w-4 h-4" />
                ) : (
                  <Edit className="w-4 h-4" />
                )
              }
              onClick={
                editingRatios ? handleSaveRatios : () => setEditingRatios(true)
              }
              size="sm"
            >
              {editingRatios ? "Save Changes" : "Edit Ratios"}
            </Button>
            {editingRatios && (
              <Button
                color="primary"
                variant="shadow"
                onClick={() => setEditingRatios(false)}
                size="sm"
              >
                Cancel
              </Button>
            )}
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-200">
                Gold to INR Ratio
              </label>
              <Input
                type="number"
                value={goldToINRRatio.toString()}
                onChange={(e) => setGoldToINRRatio(Number(e.target.value))}
                disabled={!editingRatios}
                variant="bordered"
                startContent={<Coins className="w-4 h-4 text-yellow-400" />}
                endContent={
                  <span className="text-small text-default-400">INR/g</span>
                }
                classNames={{
                  input: "text-white",
                  inputWrapper: "bg-white/10 data-[hover=true]:bg-white/20",
                }}
              />
              <p className="text-xs text-purple-200">
                1 Gold Coin = ₹{goldToINRRatio.toLocaleString()}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-200">
                Redeem Coin to Gold Ratio
              </label>
              <Input
                type="number"
                value={redeemCoinToGoldRatio.toString()}
                onChange={(e) =>
                  setRedeemCoinToGoldRatio(Number(e.target.value))
                }
                disabled={!editingRatios}
                variant="bordered"
                startContent={<Coins className="w-4 h-4 text-yellow-400" />}
                endContent={
                  <span className="text-small text-default-400">g/coin</span>
                }
                classNames={{
                  input: "text-white",
                  inputWrapper: "bg-white/10 data-[hover=true]:bg-white/20",
                }}
              />
              <p className="text-xs text-purple-200">
                1 Redeem Coin = {redeemCoinToGoldRatio} Gold Coin
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}

export default RatiosCard;

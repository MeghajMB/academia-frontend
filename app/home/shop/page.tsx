"use client";
import React, { useState } from "react";
import { Card, CardBody, CardHeader, Badge, Button } from "@heroui/react";
import { Coins } from "lucide-react";
import ProtectedRoute from "@/hoc/ProtectedRoute";
import RenderRazorpay from "@/components/Payment/RenderRazorpay";
import usePaymentApi from "@/hooks/api/usePaymentApi";

const coinPackages = [
  { coins: 100, price: 90 },
  { coins: 500, price: 450 },
  { coins: 1500, price: 1300 },
  { coins: 3000, price: 2700 },
  { coins: 5000, price: 4500 },
  { coins: 10000, price: 8900 },
];
const ShopCoins = () => {
  return (
    <ProtectedRoute role={["instructor","student"]}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Purchase Coins</h1>
          <p className="text-gray-600">
            Get more coins to unlock premium features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coinPackages.map(({ coins, price }) => (
            <Card key={coins} className="border border-indigo-200">
              <CardHeader className="flex flex-col items-center pt-6 pb-2">
                <div className="bg-indigo-100 p-3 rounded-full mb-3">
                  <Coins className="w-8 h-8 text-yellow-400" />
                </div>
                <h2 className="text-2xl font-bold text-indigo-600">
                  {coins.toLocaleString()} Coins
                </h2>
              </CardHeader>
              <CardBody className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <span className="text-3xl font-bold">₹{price}</span>
                  {price < coins && (
                    <Badge color="success" variant="flat">
                      Save ₹{coins - price}
                    </Badge>
                  )}
                </div>
                <RenderRazorpay
                  keyId={process.env.REACT_APP_RAZORPAY_KEY_ID!}
                  coins={coins}
                  price={price}
                />
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ShopCoins;

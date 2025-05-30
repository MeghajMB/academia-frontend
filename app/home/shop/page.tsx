"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Coins, Sparkles } from "lucide-react";
import { Button, Spinner } from "@heroui/react";
import useRazorpayPayment from "@/hooks/useRazorPayment";
import useCoinApi from "@/hooks/api/useCoinApi";

interface CoinPackage {
  id: string;
  coinAmount: number;
  priceInINR: number;
}

export default function PurchaseCoins() {
  const [packages, setPackages] = useState<CoinPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const { handlePurchase } = useRazorpayPayment();
  const {fetchCoinPackagesApi} =useCoinApi()
  useEffect(() => {
    async function fetchCoinPackages() {
      try {
        setLoading(true);
        // Replace with your actual API call
        const response = await fetchCoinPackagesApi();
        if (response.status === "error") throw new Error(response.message);
        setPackages(response.data.packages);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchCoinPackages();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-5 pb-4">
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
              <Coins className="h-8 w-8 text-amber-500" />
            </div>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Purchase Coins
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Boost your experience with our premium coins. Choose a package
              that suits your needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="pb-3">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <Spinner />
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all dark:bg-gray-800"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
                      <Coins className="h-6 w-6 text-amber-500" />
                    </div>
                    <div className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      Best Value
                    </div>
                  </div>

                  <div className="mb-6 flex items-baseline">
                    <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
                      {pkg.coinAmount}
                    </span>
                    <span className="ml-2 text-xl font-medium text-gray-500 dark:text-gray-400">
                      coins
                    </span>
                  </div>

                  <div className="mb-8 space-y-4">
                    <div className="flex items-center">
                      <Sparkles className="mr-2 h-5 w-5 text-amber-500" />
                      <span className="text-gray-600 dark:text-gray-300">
                        Unlock special features
                      </span>
                    </div>
                  </div>

                  <div className="mb-6 flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      ₹{pkg.priceInINR}
                    </span>
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      INR
                    </span>
                  </div>

                  <Button
                    color="default"
                    className=" bg-gradient-to-r from-amber-500 to-amber-600"
                    size="lg"
                    onPress={() => handlePurchase(pkg.id, "coins")}
                  >
                    Purchase Now
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

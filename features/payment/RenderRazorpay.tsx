"use client";
import usePaymentApi from "@/hooks/api/usePaymentApi";
import { Button } from "@heroui/react";
import { useRef } from "react";

// Function to load script and append in the DOM tree.
const loadScript = (src: string) =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      console.log("Razorpay loaded successfully");
      resolve(true);
    };
    script.onerror = () => {
      console.log("Error loading Razorpay");
      resolve(false);
    };
    document.body.appendChild(script);
  });

const RenderRazorpay = ({ keyId,coins,price }: { keyId: string,coins:number,price:number }) => {
  const paymentId = useRef<string | null>(null);
  const paymentMethod = useRef<string | null>(null);
  const { createOrderApi } = usePaymentApi();

  // Function to load Razorpay checkout modal
  const displayRazorpay = async (options: any) => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      console.log("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const rzp1 = new window.Razorpay(options);

    // Retrieve the chosen payment method
    rzp1.on("payment.submit", (response) => {
      paymentMethod.current = response.method;
      console.log("Payment submitted");
    });

    // Capture payment ID in case of failure
    rzp1.on("payment.failed", (response) => {
      paymentId.current = response.error.metadata.payment_id;
    });

    rzp1.open();
  };

  // Handling payment status updates
  const handlePayment = async (status: string) => {
    if (status === "Cancelled") {
      console.log("Payment is cancelled");
    }
  };

  // Function to initiate a purchase
  async function handlePurchase(coins: number, price: number) {
    try {
      const data = await createOrderApi(price, "INR");

      if (data && data.order_id) {
        // Set options dynamically
        const options = {
          key: keyId,
          amount: data.amount,
          currency: data.currency,
          name: "Academia",
          description: "Online Payment",
          order_id: data.order_id,
          handler: (response: any) => {
            console.log("Payment Successful:", response);
          },
          modal: {
            confirm_close: true,
            ondismiss: async (reason: any) => {
              const { reason: paymentReason, field, step, code } =
                reason?.error || {};

              if (!reason) {
                console.log("Payment cancelled");
                handlePayment("Cancelled");
              } else if (reason === "timeout") {
                console.log("Payment timed out");
                handlePayment("Timeout");
              } else {
                console.log("Payment failed");
                handlePayment("Failed");
              }
            },
          },
          retry: { enabled: false },
          timeout: 900,
          theme: { color: "black" },
        };

        displayRazorpay(options);
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  }

  return (
    <Button
      color="primary"
      className="w-full font-semibold"
      size="lg"
      onPress={() => handlePurchase(coins, price)} // Example values (coins, price)
    >
      Purchase Now
    </Button>
  );
};

export default RenderRazorpay;

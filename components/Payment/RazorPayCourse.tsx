"use client";
import usePaymentApi from "@/hooks/api/usePaymentApi";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "react-toastify";

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

const RazorpayCourse = ({
  courseId,
  type,
}: {
  courseId: string;
  type: string;
}) => {
  const paymentId = useRef<string | null>(null);
  const paymentMethod = useRef<string | null>(null);
  const { createOrderApi, paymentSuccessApi } = usePaymentApi();
  const router = useRouter();

  // Function to load Razorpay checkout modal
  const displayRazorpay = async (options: any) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

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
      toast.error("Payment Failed! Try again later", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      paymentId.current = response.error.metadata.payment_id;
    });

    rzp1.open();
  };

  // Function to initiate a purchase
  async function handlePurchase() {
    try {
      const data = await createOrderApi(courseId, type);

      if (data && data.order_id) {
        // Set options dynamically
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: data.currency,
          name: "Academia",
          description: "Online Payment",
          order_id: data.order_id,
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            const paymentDetails = {
              itemId: courseId,
              paymentType: type,
              amount: data.amount,
            };
            const responseData = await paymentSuccessApi(
              response,
              paymentDetails
            );
            toast.success("Course successfully purchased", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            router.push("/home"); // show the success page
          },
          modal: {
            confirm_close: true,
            ondismiss: async (reason: any) => {
              
              console.log("Razorpay closed")
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
      color="default"
      className="w-full font-semibold"
      size="lg"
      onPress={() => handlePurchase()} // Example values (coins, price)
    >
      Purchase Now
    </Button>
  );
};

export default RazorpayCourse;

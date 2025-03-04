import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";

export default function PageNotFound() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-black text-white">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-lg mt-2">
        The page you are looking for does not exist or has been removed.
      </p>
      <Button
        onPress={() => router.push("/home")}
        color="secondary"
        className="mt-4"
      >
        Go to Home
      </Button>
    </div>
  );
}

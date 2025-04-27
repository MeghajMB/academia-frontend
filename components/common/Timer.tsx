"use client";
import { useEffect, useState } from "react";

export default function Timer({
  onChangeResend,
}: {
  onChangeResend: (value: boolean) => void;
}) {
  const [time, setTime] = useState(60);
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime < 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    const timeout = setTimeout(() => {
      clearInterval(timer);
      onChangeResend(true);
    }, 60 * 1000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, []);
  return (
    <>
      {time>0 && <div className="">{time}</div>}
    </>
  );
}

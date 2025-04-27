"use client";

import { useAnimationFrame } from "framer-motion";
import { useRef } from "react";

export default function Cube() {
  const ref = useRef<HTMLDivElement>(null);

  useAnimationFrame((t) => {
    if (!ref.current) return;

    const rotate = Math.sin(t / 10000) * 200;
    const y = (1 + Math.sin(t / 1000)) ;
    ref.current.style.transform = `translateY(${y}px) rotateX(${rotate}deg) rotateY(${rotate}deg)`;
  });

  return (
    <div className="flex justify-center items-center h-[300px]">
      <div className="w-[200px] h-[200px] [perspective:800px]">
        <div
          ref={ref}
          className="relative w-full h-full [transform-style:preserve-3d]"
        >
          <div className="absolute w-full h-full opacity-60 bg-red-500 [transform:rotateY(0deg)_translateZ(100px)]" />
          <div className="absolute w-full h-full opacity-60 bg-orange-500 [transform:rotateY(90deg)_translateZ(100px)]" />
          <div className="absolute w-full h-full opacity-60 bg-yellow-500 [transform:rotateY(180deg)_translateZ(100px)]" />
          <div className="absolute w-full h-full opacity-60 bg-green-500 [transform:rotateY(-90deg)_translateZ(100px)]" />
          <div className="absolute w-full h-full opacity-60 bg-blue-500 [transform:rotateX(90deg)_translateZ(100px)]" />
          <div className="absolute w-full h-full opacity-60 bg-purple-500 [transform:rotateX(-90deg)_translateZ(100px)]" />
        </div>
      </div>
    </div>
  );
}

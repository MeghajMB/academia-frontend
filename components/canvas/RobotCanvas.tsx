"use client";
import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import RobotModel from "../models/RobotModel";
import { OrbitControls } from "@react-three/drei";
import { Spinner } from "@heroui/react";
import { Html } from "@react-three/drei";
import ErrorBoundary from "../common/ErrorBoundary";
export default function RobotCanvas() {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex items-center justify-center h-full bg-gray-900 text-white">
          <p>Unable to load 3D model. Your device may not support WebGL.</p>
        </div>
      }
    >
      <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 3] }}>
        <ambientLight intensity={Math.PI / 2} />
        <directionalLight intensity={Math.PI} position={[10, 10, 10]} />
        <Suspense fallback={<FallbackLoader />}>
          <RobotModel />
        </Suspense>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </ErrorBoundary>
  );
}

function FallbackLoader() {
  return (
    <Html center>
      <Spinner />
    </Html>
  );
}

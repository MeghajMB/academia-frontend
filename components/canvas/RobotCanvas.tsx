"use client";
import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import RobotModel from "../models/RobotModel";
import { OrbitControls } from "@react-three/drei";
import { Spinner } from "@heroui/react";
import { Html } from "@react-three/drei";
export default function RobotCanvas() {
  return (
    <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 3] }}>
      <ambientLight intensity={Math.PI / 2} />
      <directionalLight intensity={Math.PI} position={[10, 10, 10]} />
      <Suspense fallback={<FallbackLoader />}>
        <RobotModel />
      </Suspense>
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}

function FallbackLoader() {
  return (
    <Html center>
      <Spinner />
    </Html>
  );
}

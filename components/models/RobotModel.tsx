"use client";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { Group } from "three";

export default function RobotModel() {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF("/models/robot_playground.glb");
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    if (names.length > 0) {
      actions[names[0]]?.reset().fadeIn(0.5).play();
    }
  }, [actions, names]);

  return (
    <primitive
      object={scene}
      ref={group}
      position={[0, -0.8, 0]}
      scale={[1.2, 1.2, 1.2]}
    />
  );
}

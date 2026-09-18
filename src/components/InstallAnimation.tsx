import { useFrame } from "@react-three/fiber";
import type React from "react";
import { useRef } from "react";
import * as THREE from "three";

type InstallAnimationProps = {
  children: React.ReactNode;
  offset: [number, number, number];
  speed?: number;
};

const targetPosition = new THREE.Vector3(0, 0, 0);

export function InstallAnimation({ children, offset, speed = 8 }: InstallAnimationProps) {
  const groupref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const group = groupref.current;

    if (!group) return;

    const smoothing = 1 - Math.exp(-speed * delta);
    group.position.lerp(targetPosition, smoothing);
  });

  return (
    <group ref={groupref} position={offset}>
      {children}
    </group>
  );
}

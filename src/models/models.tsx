import { Clone, useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

const BASE = import.meta.env.BASE_URL;

type ModelProps = ThreeElements["group"];

export function Case(props: ModelProps) {
  const { scene } = useGLTF(`${BASE}models/corsair_400d.glb`);

  useEffect(() => {
    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      if (child.name === "Object_42") {
        child.castShadow = false;

        const material = child.material;

        if (material instanceof THREE.MeshStandardMaterial) {
          material.transparent = true;
          material.opacity = 0.12;
          material.depthWrite = false;
        }

        return;
      }

      child.castShadow = true;
      child.receiveShadow = true;
    });
  }, [scene]);

  useGLTF.preload("/models/corsair_400d.glb");

  return (
    <group {...props}>
      <primitive object={scene} scale={10} position={[0, -1.8, 0]} />
    </group>
  );
}

export function Motherboard(props: ModelProps) {
  const { scene } = useGLTF(`${BASE}models/motherboard__components.glb`);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useGLTF.preload("/models/motherboard__components.glb");

  return (
    <group {...props}>
      <Clone object={scene} />
    </group>
  );
}

export function PSU(props: ModelProps) {
  const { scene } = useGLTF(`${BASE}models/psu_power_supply_unit.glb`);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

   useGLTF.preload(`${BASE}models/psu_power_supply_unit.glb`);

  return (
    <group {...props}>
      <Clone object={scene} />
    </group>
  );
}

export function GPUModel(props: ModelProps) {
  const { scene } = useGLTF(`${BASE}models/nvidia_rtx_2080_ti.glb`);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useGLTF.preload(`${BASE}models/nvidia_rtx_2080_ti.glb`);

  return (
    <group {...props}>
      <Clone object={scene} />
    </group>
  );
}

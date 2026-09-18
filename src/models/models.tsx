import { Clone, useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";

const BASE = import.meta.env.BASE_URL;

type ModelProps = ThreeElements["group"];

export function Case(props: ModelProps) {
  const { scene } = useGLTF(`${BASE}models/corsair_400d.glb`);
  return (
    <group {...props}>
      <primitive object={scene} scale={10} position={[0, -1.8, 0]} />
    </group>
  );
}

export function Motherboard(props: ModelProps) {
  const { scene } = useGLTF(`${BASE}models/motherboard__components.glb`);

  return (
    <group {...props}>
      <Clone object={scene} />
    </group>
  );
}

export function PSU(props: ModelProps) {
  const { scene } = useGLTF(`${BASE}models/psu_power_supply_unit.glb`);

  return (
    <group {...props}>
      <Clone object={scene} />
    </group>
  );
}

export function GPUModel(props: ModelProps) {
  const { scene } = useGLTF(`${BASE}models/nvidia_rtx_2080_ti.glb`);

  return (
    <group {...props}>
      <Clone object={scene} />
    </group>
  );
}

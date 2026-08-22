import { useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";

type RetroComputerProps = ThreeElements["group"];

export function RetroComputer(props: RetroComputerProps) {
  const { scene } = useGLTF("/retro_computer/scene.gltf");
  return (
    <group {...props}>
      <primitive object={scene} />
    </group>
  );
}

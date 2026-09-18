import { Case, GPUModel, Motherboard, PSU } from "@/models/models";
import { corsair4000DTransforms } from "./configs/corsair4000D";
import type { ThreeElements } from "@react-three/fiber";
import { useBuildStore } from "@/stores/BuildStore";

type PcAssemblyProps = ThreeElements["group"];

export function PcAssembly(props: PcAssemblyProps) {
  const gpu = useBuildStore((state) => state.build.GPU);
  const motherboard = useBuildStore((state) => state.build.MOTHERBOARD);
  const psu = useBuildStore((state) => state.build.PSU);
  console.log("3D GPU:", gpu);
  return (
    <group {...props}>
      <Case />
      {motherboard && <Motherboard {...corsair4000DTransforms.motherboard} />}
      {gpu && <GPUModel {...corsair4000DTransforms.gpu} />}
      {psu && <PSU {...corsair4000DTransforms.psu} />}
    </group>
  );
}

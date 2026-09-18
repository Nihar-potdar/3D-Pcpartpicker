import { Case, GPUModel, Motherboard, PSU } from "@/models/models";
import { corsair4000DTransforms } from "@/models/models";
import type { ThreeElements } from "@react-three/fiber";
import { useBuildStore } from "@/stores/BuildStore";

type PcAssemblyProps = ThreeElements["group"];

export function PcAssembly(props: PcAssemblyProps) {
  const gpu = useBuildStore((state) => state.build.GPU);
  return (
    <group {...props}>
      <Case />
      <Motherboard {...corsair4000DTransforms.motherboard} />
      {gpu && <GPUModel {...corsair4000DTransforms.gpu} />}
      <PSU {...corsair4000DTransforms.psu} />
    </group>
  );
}

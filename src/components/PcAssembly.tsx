import { Case, GPUModel, Motherboard, PSU } from "@/models/models";
import { corsair4000DTransforms } from "./configs/corsair4000D";
import { type ThreeElements } from "@react-three/fiber";
import { useBuildStore } from "@/stores/BuildStore";
import { InstallAnimation } from "./InstallAnimation";

type PcAssemblyProps = ThreeElements["group"];

export function PcAssembly(props: PcAssemblyProps) {
  const gpu = useBuildStore((state) => state.build.GPU);
  const motherboard = useBuildStore((state) => state.build.MOTHERBOARD);
  const psu = useBuildStore((state) => state.build.PSU);
  return (
    <group {...props}>
      <Case />
      {motherboard && (
        <group key={`MOTHERBOARD-${motherboard.id}`} {...corsair4000DTransforms.motherboard}>
          <InstallAnimation offset={[0, 0, 0.5]}>
            <Motherboard />
          </InstallAnimation>
        </group>
      )}
      {gpu && (
        <group key={`GPU-${gpu.id}`} {...corsair4000DTransforms.gpu}>
          <InstallAnimation offset={[1, 0, 0]}>
            <GPUModel />
          </InstallAnimation>
        </group>
      )}
      {psu && (
        <group key={`PSU-${psu.id}`} {...corsair4000DTransforms.psu}>
          <InstallAnimation offset={[0, -0.4, 0.5]}>
            <PSU />
          </InstallAnimation>
        </group>
      )}
    </group>
  );
}

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
// import { RetroComputer } from "../Threejs/firstcanvas";
import { InsideAPC } from "../Threejs/InsideAPc";

interface Canvas1Props {
  className?: string;
}

export default function Canvas1({ className }: Canvas1Props) {
  return (
    <div className={`w-full h-full ${className ?? ""}`}>
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={10.0} />
        <directionalLight position={[10, 5, 0]} intensity={1.5} castShadow />
        <InsideAPC scale={1} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

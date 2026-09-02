import { Canvas } from "@react-three/fiber";
import { Bounds, Center, Grid, OrbitControls } from "@react-three/drei";
import { InsideAPC } from "../Threejs/InsideAPc";

interface Canvas1Props {
  className?: string;
}

export default function Canvas1({ className }: Canvas1Props) {
  return (
    <div className={`w-full h-full ${className ?? ""}`}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        shadows
        camera={{ position: [0, 1.2, 6.4], fov: 42 }}
      >
        <ambientLight intensity={1.25} />
        <hemisphereLight color="#caffb0" groundColor="#11150f" intensity={1.7} />
        <directionalLight position={[7, 8, 5]} intensity={3.2} color="#fff4cc" castShadow />
        <pointLight position={[-5, 1, 2]} intensity={22} distance={10} color="#68ff65" />
        <Bounds fit clip observe margin={1.35}>
          <Center>
            <group rotation={[0.02, -0.24, 0]}>
              <InsideAPC />
            </group>
          </Center>
        </Bounds>
        <Grid
          position={[0, -1.75, 0]}
          args={[20, 20]}
          cellColor="#315b35"
          sectionColor="#73d96a"
          cellSize={0.45}
          sectionSize={2.25}
          fadeDistance={12}
          fadeStrength={1.3}
          infiniteGrid
        />
        <OrbitControls
          makeDefault
          autoRotate
          autoRotateSpeed={0.35}
          enableDamping
          dampingFactor={0.06}
          minDistance={3.6}
          maxDistance={9}
          maxPolarAngle={Math.PI / 1.75}
        />
      </Canvas>
    </div>
  );
}

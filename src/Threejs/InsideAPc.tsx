import { useGLTF } from "@react-three/drei"
import type { ThreeElements } from "@react-three/fiber"

type InsideAPc = ThreeElements['group']

export function InsideAPC(props: InsideAPc) {
  const { scene } = useGLTF('/motherboard white/scene.gltf')
  return (
    <group {...props} >
      <primitive object={scene} />
    </group>
  )
}


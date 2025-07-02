import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

function HumanModel({ url }) {
  const { scene } = useGLTF(url);
  scene.traverse((child) => {
    if (child.isMesh) {
      child.material.color.set("lightblue");
    }
  });
  scene.scale.set(0.5, 0.5, 0.5);
  return <primitive object={scene} />;
}

useGLTF.preload("/male_body.glb");

export default function App() {
  return (
    <Canvas camera={{ position: [0, 1.5, 4], fov: 40 }}>
      <ambientLight />
      <directionalLight position={[5, 5, 5]} />
      <Suspense fallback={null}>
        <HumanModel url="/male_body.glb" />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}

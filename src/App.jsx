import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

function HumanModel({ url }) {
  const { scene } = useGLTF(url);
  
  scene.traverse((child) => {
    if (child.isMesh) {
      child.material.color.set("#77efff");
    }
  });
  
  // Center the model at origin and scale appropriately
  scene.position.set(0, -14, 0);
  scene.scale.set(0.4, 0.4, 0.4);
  
  return <primitive object={scene} />;
}

useGLTF.preload("/male_body.glb");


export default function App() {
  return (
    <Canvas camera={{ position: [0, -4, 20], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      <Suspense fallback={null}>
        <HumanModel url="/male_body.glb" />
      </Suspense>
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </Canvas>
  );
}

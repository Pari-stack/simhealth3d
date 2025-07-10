
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

  return (
    <group position={[0, -14, 0]} scale={[0.4, 0.4, 0.4]}>
      <primitive object={scene} />
    </group>
  );
}

export default function Splash() {
  return (
    <div className="splash-container">
      <div className="splash-content">
        {/* Logo and Tagline */}
        <img src="/logo-placeholder.png" alt="App Logo" className="logo" />
        <h1>Your Personal AI Doctor</h1>

        {/* Features */}
        <ul className="features-list">
          <li>💡 AI-Powered Health Insights</li>
          <li>🧠 3D Body Visualization</li>
          <li>📈 Personalized Health Tracking</li>
        </ul>
      </div>

      {/* 3D Animation Area */}
      <div className="splash-canvas">
        <Canvas camera={{ position: [0, 0, 20], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} />
          <Suspense fallback={null}>
            <HumanModel url="/male_body.glb" />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>
    </div>
  );
}

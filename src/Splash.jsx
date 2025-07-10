import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import HomeScreen from "./Home"; 

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
            {/* You can later add more animated 3D elements here */}
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>
    </div>
  );
}

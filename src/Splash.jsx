
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Text } from "@react-three/drei";
import { Suspense, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function FloatingText({ text, position, color = "#ffffff" }) {
  const textRef = useRef();
  
  useFrame(({ clock }) => {
    if (textRef.current) {
      textRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 2) * 0.5;
      textRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={1}
      color={color}
      anchorX="center"
      anchorY="middle"
      font="/fonts/helvetiker_regular.typeface.json"
    >
      {text}
    </Text>
  );
}

function AnimatedParticles() {
  const particlesRef = useRef();
  const particleCount = 50;
  
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    
    velocities[i * 3] = (Math.random() - 0.5) * 0.1;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
  }

  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];
        
        if (Math.abs(positions[i * 3]) > 25) velocities[i * 3] *= -1;
        if (Math.abs(positions[i * 3 + 1]) > 25) velocities[i * 3 + 1] *= -1;
        if (Math.abs(positions[i * 3 + 2]) > 25) velocities[i * 3 + 2] *= -1;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#77efff" size={0.5} transparent opacity={0.6} />
    </points>
  );
}

function HumanModel({ url }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef();

  useFrame(({ clock }) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
      modelRef.current.position.y = -14 + Math.sin(clock.getElapsedTime() * 1.5) * 0.5;
    }
  });

  scene.traverse((child) => {
    if (child.isMesh) {
      child.material.color.set("#77efff");
      child.material.emissive = new THREE.Color("#003366");
      child.material.emissiveIntensity = 0.3;
    }
  });

  return (
    <group ref={modelRef} position={[0, -14, 0]} scale={[0.35, 0.35, 0.35]}>
      <primitive object={scene} />
    </group>
  );
}

export default function Splash() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        navigate('/home');
      }, 1000); // Allow 1 second for fade out animation
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={`splash-container ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <div className="logo-section">
          <div className="pulse-logo">🏥</div>
          <h1 className="main-title">SimHealth AI</h1>
          <p className="tagline">Your Personal AI Doctor</p>
        </div>

        <div className="features-list">
          <div className="feature-item">
            <span className="feature-icon">🧠</span>
            <span>AI-Powered Health Insights</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <span>3D Body Visualization</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <span>Personalized Health Tracking</span>
          </div>
        </div>

        <div className="loading-section">
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
          <p className="loading-text">Initializing AI Systems...</p>
        </div>
      </div>

      <div className="splash-canvas">
        <Canvas camera={{ position: [0, -2, 18], fov: 60 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} color="#77efff" />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#ff7777" />
          <pointLight position={[0, 10, 0]} intensity={0.8} color="#ffffff" />
          
          <Suspense fallback={null}>
            <HumanModel url="/male_body.glb" />
            <AnimatedParticles />
            <FloatingText text="AI" position={[-8, 5, 0]} color="#77efff" />
            <FloatingText text="HEALTH" position={[8, 5, 0]} color="#ff7777" />
            <FloatingText text="SCAN" position={[0, 8, 0]} color="#ffff77" />
          </Suspense>
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={1}
          />
        </Canvas>
      </div>
    </div>
  );
}

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useState, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function PainMarker({ position, severity }) {
  const meshRef = useRef();
  const groupRef = useRef();
  const { camera } = useThree();

  useFrame(({ clock }) => {
    const pulse = 0.5 + 0.5 * Math.sin(clock.getElapsedTime() * 3);

    if (meshRef.current) {
      meshRef.current.material.emissiveIntensity = 0.5 + 0.5 * pulse;
      meshRef.current.scale.setScalar(1 + 0.1 * pulse); // subtle size pulsing
    }

    if (groupRef.current) {
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      const offset = dir.multiplyScalar(-0.4);
      groupRef.current.position.set(
        position[0] + offset.x,
        position[1] + offset.y,
        position[2] + offset.z
      );
    }
  });

  const color =
    severity >= 8
      ? new THREE.Color("#ff2400") // red
      : severity >= 4
      ? new THREE.Color("#ff9900") // orange
      : new THREE.Color("#ffff33"); // yellow

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}



function HumanModel({ url, onClick }) {
  const { scene } = useGLTF(url);

  scene.traverse((child) => {
    if (child.isMesh) {
      child.material.color.set("#77efff");
    }
  });

  return (
    <group
      onPointerDown={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      position={[0, -14, 0]}
      scale={[0.4, 0.4, 0.4]}
    >
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/male_body.glb");

export default function Home() {
  const [painPoints, setPainPoints] = useState([]);
  const [clickedPoint, setClickedPoint] = useState(null); //store the location where the user clicked
  const [severity, setSeverity] = useState(5);
  const submitSeverity = () => {
    const newPoint = {
      position: [clickedPoint.x, clickedPoint.y, clickedPoint.z],
      severity,
      timestamp: new Date().toISOString(),
    };

    setPainPoints((prev) => [...prev, newPoint]);

    // Reset
    setClickedPoint(null);
    setSeverity(5);
  };

  const handleClick = (e) => {
    const point = e.point;
    if (!point) return;

    console.log("✅ Clicked point:", point);
    setClickedPoint(point); // ✅ this triggers the slider and temporary marker
  };

  return (
    <>
    <Canvas camera={{ position: [0, -4, 20], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      <Suspense fallback={null}>
        <HumanModel url="/male_body.glb" onClick={handleClick} />

        {/* Pain Markers */}
        {painPoints.map((point, index) => (
          <PainMarker key={index} position={point.position} severity={point.severity} />
        ))}
        </Suspense>

      // orb design 
      {clickedPoint && (
        <PainMarker
          position={[clickedPoint.x, clickedPoint.y, clickedPoint.z]}
          severity={severity}
        />
      )}


      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={20}
        target={[0, 0, 0]}
      />
    </Canvas>
    {clickedPoint && (
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          background: "#fff",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
          zIndex: 1000,
        }}
      >
        <label htmlFor="severity">Severity:</label>
        <input
          id="severity"
          type="range"
          min="1"
          max="10"
          value={severity}
          onChange={(e) => setSeverity(Number(e.target.value))}
        />
        <span style={{ marginLeft: "10px" }}>{severity}</span>
        <div style={{ marginTop: "10px" }}>
          <button onClick={submitSeverity}>Log Pain</button>
          <button onClick={() => setClickedPoint(null)} style={{ marginLeft: "10px" }}>
            Cancel
          </button>
        </div>
      </div>
    )}
      </>
  );
}

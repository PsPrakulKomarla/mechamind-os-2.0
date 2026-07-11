import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Box, Text, Plane, Html } from "@react-three/drei";
import { useLiveMachineMapStream } from "@/hooks/useDigitalTwinQueries";
import { AlertTriangle, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

// A glowing machine model (abstracted as a cube with status colors)
const MachineNode = ({ id, position, status, type }: any) => {
  const meshRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const colorMap: Record<string, string> = {
    healthy: "#14F195", // Green
    warning: "#f59e0b", // Yellow
    critical: "#ef4444", // Red
  };

  const baseColor = colorMap[status] || "#94a3b8";

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle hovering animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1;
      
      // If critical, pulse quickly
      if (status === "critical") {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 10) * 0.1);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <group position={position}>
      <mesh 
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => navigate(`/digital-twin/machines/${id}`)}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={baseColor} 
          emissive={baseColor}
          emissiveIntensity={hovered ? 0.8 : 0.4}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* 3D Label */}
      <Text position={[0, 1.2, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        {id}
      </Text>

      {/* HTML Overlay for interactions */}
      {hovered && (
        <Html position={[0, 1.8, 0]} center zIndexRange={[100, 0]}>
          <div className="bg-primary-bg/90 backdrop-blur border border-gray-700 p-3 rounded-lg shadow-2xl min-w-[150px] pointer-events-none">
            <h4 className="font-bold text-white text-sm mb-1">{type.toUpperCase()}</h4>
            <div className="flex items-center gap-2 text-xs">
              {status === "critical" && <AlertTriangle size={12} className="text-danger" />}
              {status === "warning" && <AlertTriangle size={12} className="text-warning" />}
              {status === "healthy" && <Settings size={12} className="text-success" />}
              <span className={`uppercase font-bold ${
                status === "critical" ? "text-danger" : 
                status === "warning" ? "text-warning" : "text-success"
              }`}>
                {status}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 mt-2">Click to monitor live</p>
          </div>
        </Html>
      )}
    </group>
  );
};

export const InteractiveFactoryMap3D = () => {
  const machines = useLiveMachineMapStream();

  return (
    <div className="w-full h-full bg-[#050505] rounded-lg overflow-hidden border border-gray-800 relative shadow-inner">
      <Canvas camera={{ position: [0, 8, 10], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          minPolarAngle={Math.PI / 6} 
          maxPolarAngle={Math.PI / 2 - 0.1}
          maxDistance={20}
        />

        {/* Factory Floor */}
        <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <meshStandardMaterial color="#1e293b" roughness={0.8} metalness={0.2} />
        </Plane>

        {/* Grid Helper for blueprint feel */}
        <gridHelper args={[20, 20, "#334155", "#0f172a"]} position={[0, -0.49, 0]} />

        {/* Render Machines */}
        {machines.map((machine) => (
          <MachineNode 
            key={machine.id}
            id={machine.id}
            type={machine.type}
            status={machine.status}
            position={[machine.x, machine.y, machine.z]}
          />
        ))}
      </Canvas>
      
      <div className="absolute top-4 left-4 bg-primary-bg/80 backdrop-blur p-3 border border-gray-800 rounded-lg pointer-events-none">
        <h3 className="font-bold text-white text-sm">Line Alpha Layout</h3>
        <p className="text-xs text-gray-400">Scroll to zoom. Drag to pan/rotate.</p>
      </div>
    </div>
  );
};

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, Box, Torus, MeshDistortMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Floating geometric shape component
const FloatingShape = ({ 
  position, 
  shape, 
  color, 
  scale = 1,
  speed = 1 
}: { 
  position: [number, number, number]; 
  shape: 'sphere' | 'box' | 'torus';
  color: string;
  scale?: number;
  speed?: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
    }
  });

  const ShapeComponent = () => {
    switch (shape) {
      case 'sphere':
        return (
          <Sphere args={[0.5, 32, 32]} ref={meshRef}>
            <MeshDistortMaterial
              color={color}
              attach="material"
              distort={0.3}
              speed={2}
              roughness={0.2}
              metalness={0.8}
            />
          </Sphere>
        );
      case 'box':
        return (
          <Box args={[0.8, 0.8, 0.8]} ref={meshRef}>
            <meshStandardMaterial
              color={color}
              roughness={0.1}
              metalness={0.9}
            />
          </Box>
        );
      case 'torus':
        return (
          <Torus args={[0.5, 0.2, 16, 32]} ref={meshRef}>
            <meshStandardMaterial
              color={color}
              roughness={0.15}
              metalness={0.85}
            />
          </Torus>
        );
      default:
        return null;
    }
  };

  return (
    <Float
      speed={speed}
      rotationIntensity={0.5}
      floatIntensity={0.8}
      position={position}
    >
      <group scale={scale}>
        <ShapeComponent />
      </group>
    </Float>
  );
};

// Particle field component
const ParticleField = ({ count = 100 }: { count?: number }) => {
  const points = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02;
      points.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#3b82f6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

// Mouse parallax effect
const MouseParallax = ({ children }: { children: React.ReactNode }) => {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (group.current) {
      const x = (state.mouse.x * viewport.width) / 50;
      const y = (state.mouse.y * viewport.height) / 50;
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.1, 0.05);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.1, 0.05);
    }
  });

  return <group ref={group}>{children}</group>;
};

// Main 3D Scene
const Scene = () => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#3b82f6" />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#06b6d4" />

      <MouseParallax>
        {/* Floating Shapes */}
        <FloatingShape position={[-3, 1.5, -2]} shape="sphere" color="#3b82f6" scale={1.2} speed={0.8} />
        <FloatingShape position={[3, -1, -1]} shape="box" color="#06b6d4" scale={0.9} speed={1.2} />
        <FloatingShape position={[-2, -1.5, 0]} shape="torus" color="#0ea5e9" scale={1} speed={1} />
        <FloatingShape position={[2.5, 2, -3]} shape="sphere" color="#0284c7" scale={0.7} speed={1.5} />
        <FloatingShape position={[-4, 0, -4]} shape="box" color="#0891b2" scale={0.6} speed={0.9} />
        <FloatingShape position={[4, -2, -2]} shape="torus" color="#3b82f6" scale={0.8} speed={1.1} />
        
        {/* Additional smaller shapes for depth */}
        <FloatingShape position={[1, 3, -5]} shape="sphere" color="#38bdf8" scale={0.4} speed={2} />
        <FloatingShape position={[-3, -3, -6]} shape="box" color="#22d3ee" scale={0.3} speed={1.8} />

        {/* Particle Field */}
        <ParticleField count={150} />
      </MouseParallax>

      {/* Orbit Controls - disabled for production, enable for debugging */}
      {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
    </>
  );
};

// Fallback component for loading
const Fallback = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

// Main export component
export const HeroScene3D = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <Suspense fallback={<Fallback />}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <Scene />
        </Canvas>
      </Suspense>
      
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background pointer-events-none" />
    </div>
  );
};

export default HeroScene3D;

'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text3D, Center, Float, Environment } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function RotatingCafeText() {
    const meshRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
        }
    });

    return (
        <group ref={meshRef}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <mesh>
                    <boxGeometry args={[2, 2, 2]} />
                    <meshStandardMaterial color="#8b5cf6" wireframe opacity={0.6} transparent />
                </mesh>
                <mesh>
                    <icosahedronGeometry args={[1.5, 0]} />
                    <meshStandardMaterial color="#ec4899" wireframe />
                </mesh>
            </Float>
        </group>
    );
}

export default function CanvasPlaceholder() {
    return (
        <div className="canvas-container">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Environment preset="city" />
                <RotatingCafeText />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
}

'use client'

import { Canvas } from '@react-three/fiber'
import { Float, Text3D, OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'

function IslamicSymbols() {
  return (
    <>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[2, 0, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#8F4843" />
        </mesh>
      </Float>
      
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[-2, 1, -1]}>
          <octahedronGeometry args={[0.4]} />
          <meshStandardMaterial color="#2E3F44" />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={0.8} floatIntensity={1.5}>
        <mesh position={[0, -1, 1]}>
          <dodecahedronGeometry args={[0.25]} />
          <meshStandardMaterial color="#8B8F65" />
        </mesh>
      </Float>

      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} />
    </>
  )
}

export default function FloatingElements() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Suspense fallback={null}>
          <IslamicSymbols />
        </Suspense>
      </Canvas>
    </div>
  )
}
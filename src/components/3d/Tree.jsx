'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Tree({ position, size = 1 }) {
  const leavesRef = useRef()

  // Add gentle swaying animation
  useFrame((state) => {
    if (leavesRef.current) {
      leavesRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 0.8 * size, 0]}>
        <cylinderGeometry args={[0.2 * size, 0.3 * size, 1.6 * size, 8]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>

      {/* Leaves */}
      <mesh position={[0, 1.8 * size, 0]} ref={leavesRef}>
        <sphereGeometry args={[1.2 * size, 8, 8]} />
        <meshStandardMaterial color="#228b22" />
      </mesh>

      {/* Additional leaf layer for more realistic look */}
      <mesh position={[0, 2.2 * size, 0]}>
        <sphereGeometry args={[0.8 * size, 8, 8]} />
        <meshStandardMaterial color="#32cd32" />
      </mesh>
    </group>
  )
}

'use client'

import { useRef, useEffect } from 'react'
import { Box, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export default function Player({ position, character, isMoving }) {
  const groupRef = useRef()
  const bodyRef = useRef()
  const headRef = useRef()

  // Add walking animation
  useFrame((state) => {
    if (groupRef.current) {
      // Subtle bounce when moving
      if (isMoving) {
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 8) * 0.05 + 0.5
        
        // Slight head bobbing
        if (headRef.current) {
          headRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 6) * 0.1
        }
      } else {
        groupRef.current.position.y = 0.5
        if (headRef.current) {
          headRef.current.rotation.z = 0
        }
      }
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <Box args={[0.8, 1.2, 0.4]} position={[0, 0.6, 0]} ref={bodyRef}>
        <meshStandardMaterial color="#3b82f6" />
      </Box>

      {/* Head */}
      <mesh position={[0, 1.5, 0]} ref={headRef}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>

      {/* Arms */}
      <Box args={[0.2, 0.8, 0.2]} position={[-0.6, 0.6, 0]}>
        <meshStandardMaterial color="#fbbf24" />
      </Box>
      <Box args={[0.2, 0.8, 0.2]} position={[0.6, 0.6, 0]}>
        <meshStandardMaterial color="#fbbf24" />
      </Box>

      {/* Legs */}
      <Box args={[0.2, 0.8, 0.2]} position={[-0.2, -0.4, 0]}>
        <meshStandardMaterial color="#1e40af" />
      </Box>
      <Box args={[0.2, 0.8, 0.2]} position={[0.2, -0.4, 0]}>
        <meshStandardMaterial color="#1e40af" />
      </Box>

      {/* Hat */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 8]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.1, 1.5, 0.25]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.1, 1.5, 0.25]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Player name tag */}
      {character && (
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          billboard
        >
          {character.name}
        </Text>
      )}
    </group>
  )
}

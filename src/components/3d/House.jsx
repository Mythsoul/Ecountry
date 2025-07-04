'use client'

import { useRef } from 'react'
import { Box, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export default function House({ position, house, onClick }) {
  const groupRef = useRef()
  const roofRef = useRef()

  // Add a subtle floating animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  const isOwned = house.status === 'OWNED'
  const isAvailable = house.status === 'AVAILABLE'

  return (
    <group ref={groupRef} position={position} onClick={onClick}>
      {/* House Base */}
      <Box args={[4, 3, 4]} position={[0, 1.5, 0]}>
        <meshStandardMaterial 
          color={isOwned ? '#8b5cf6' : isAvailable ? '#10b981' : '#6b7280'} 
        />
      </Box>

      {/* Roof */}
      <mesh position={[0, 3.5, 0]} ref={roofRef}>
        <coneGeometry args={[3, 2, 4]} />
        <meshStandardMaterial color={isOwned ? '#7c3aed' : '#dc2626'} />
      </mesh>

      {/* Door */}
      <Box args={[0.8, 1.5, 0.1]} position={[0, 0.75, 2.05]}>
        <meshStandardMaterial color="#8b4513" />
      </Box>

      {/* Windows */}
      <Box args={[0.8, 0.8, 0.1]} position={[-1, 1.5, 2.05]}>
        <meshStandardMaterial color="#87ceeb" />
      </Box>
      <Box args={[0.8, 0.8, 0.1]} position={[1, 1.5, 2.05]}>
        <meshStandardMaterial color="#87ceeb" />
      </Box>

      {/* Chimney */}
      <Box args={[0.5, 1.5, 0.5]} position={[1.5, 4.25, -1]}>
        <meshStandardMaterial color="#8b4513" />
      </Box>

      {/* House Info Text */}
      <Text
        position={[0, 5, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        billboard
      >
        {house.location}
      </Text>
      
      <Text
        position={[0, 4.5, 0]}
        fontSize={0.3}
        color={isAvailable ? '#10b981' : isOwned ? '#8b5cf6' : '#6b7280'}
        anchorX="center"
        anchorY="middle"
        billboard
      >
        ${house.price}
      </Text>

      <Text
        position={[0, 4, 0]}
        fontSize={0.25}
        color={isAvailable ? '#10b981' : isOwned ? '#8b5cf6' : '#ef4444'}
        anchorX="center"
        anchorY="middle"
        billboard
      >
        {house.status}
      </Text>
    </group>
  )
}

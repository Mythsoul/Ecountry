'use client'

import { Box, Text } from '@react-three/drei'
import { useRef } from 'react'

export default function Building({ position, type = 'shop', name = 'Building', color = '#718096' }) {
  const groupRef = useRef()

  const buildingConfigs = {
    shop: {
      size: [6, 4, 4],
      doorSize: [1.2, 2, 0.1],
      windowSize: [1, 1, 0.1],
      signColor: '#ed8936'
    },
    office: {
      size: [8, 6, 6],
      doorSize: [1.5, 2.5, 0.1],
      windowSize: [1.2, 1.2, 0.1],
      signColor: '#4299e1'
    },
    bank: {
      size: [10, 5, 8],
      doorSize: [2, 3, 0.1],
      windowSize: [1.5, 1.5, 0.1],
      signColor: '#38b2ac'
    }
  }

  const config = buildingConfigs[type] || buildingConfigs.shop

  return (
    <group ref={groupRef} position={position}>
      {/* Main Building */}
      <Box args={config.size} position={[0, config.size[1] / 2, 0]}>
        <meshStandardMaterial color={color} />
      </Box>

      {/* Door */}
      <Box args={config.doorSize} position={[0, config.doorSize[1] / 2, config.size[2] / 2 + 0.05]}>
        <meshStandardMaterial color="#8b4513" />
      </Box>

      {/* Windows */}
      <Box args={config.windowSize} position={[-config.size[0] / 3, config.size[1] / 2, config.size[2] / 2 + 0.05]}>
        <meshStandardMaterial color="#87ceeb" />
      </Box>
      <Box args={config.windowSize} position={[config.size[0] / 3, config.size[1] / 2, config.size[2] / 2 + 0.05]}>
        <meshStandardMaterial color="#87ceeb" />
      </Box>

      {/* Additional windows for taller buildings */}
      {config.size[1] > 4 && (
        <>
          <Box args={config.windowSize} position={[-config.size[0] / 3, config.size[1] - 1, config.size[2] / 2 + 0.05]}>
            <meshStandardMaterial color="#87ceeb" />
          </Box>
          <Box args={config.windowSize} position={[config.size[0] / 3, config.size[1] - 1, config.size[2] / 2 + 0.05]}>
            <meshStandardMaterial color="#87ceeb" />
          </Box>
        </>
      )}

      {/* Sign */}
      <Box args={[4, 0.8, 0.1]} position={[0, config.size[1] + 0.5, 0.1]}>
        <meshStandardMaterial color={config.signColor} />
      </Box>

      {/* Building Name */}
      <Text
        position={[0, config.size[1] + 0.5, 0.2]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>

      {/* Building Type Label */}
      <Text
        position={[0, config.size[1] + 1.5, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
        billboard
      >
        {type.toUpperCase()}
      </Text>
    </group>
  )
}

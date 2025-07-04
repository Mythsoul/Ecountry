'use client'

import { Box } from '@react-three/drei'

export default function Road({ startPosition, endPosition, width = 2 }) {
  const length = Math.sqrt(
    Math.pow(endPosition[0] - startPosition[0], 2) + 
    Math.pow(endPosition[2] - startPosition[2], 2)
  )
  
  const midPoint = [
    (startPosition[0] + endPosition[0]) / 2,
    0.01,
    (startPosition[2] + endPosition[2]) / 2
  ]

  const angle = Math.atan2(
    endPosition[2] - startPosition[2],
    endPosition[0] - startPosition[0]
  )

  return (
    <group>
      {/* Main road */}
      <Box args={[length, 0.02, width]} position={midPoint} rotation={[0, angle, 0]}>
        <meshStandardMaterial color="#4a5568" />
      </Box>

      {/* Road markings */}
      <Box 
        args={[length, 0.03, 0.1]} 
        position={[midPoint[0], 0.02, midPoint[2]]} 
        rotation={[0, angle, 0]}
      >
        <meshStandardMaterial color="#ffd700" />
      </Box>

      {/* Road edges */}
      <Box 
        args={[length, 0.025, 0.1]} 
        position={[midPoint[0], 0.015, midPoint[2] + (width/2)]} 
        rotation={[0, angle, 0]}
      >
        <meshStandardMaterial color="#2d3748" />
      </Box>
      <Box 
        args={[length, 0.025, 0.1]} 
        position={[midPoint[0], 0.015, midPoint[2] - (width/2)]} 
        rotation={[0, angle, 0]}
      >
        <meshStandardMaterial color="#2d3748" />
      </Box>
    </group>
  )
}

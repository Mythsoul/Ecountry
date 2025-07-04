'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Plane, Box, Text } from '@react-three/drei'
import { useRef, useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import api from '@/helpers/api'

// Import 3D components
import House from '@/components/3d/House'
import Player from '@/components/3d/Player'
import Tree from '@/components/3d/Tree'
import Road from '@/components/3d/Road'
import Building from '@/components/3d/Building'

export default function World() {
  const router = useRouter()
  const playerRef = useRef()
  const speed = 0.1

  // Game state
  const [gameState, setGameState] = useState(null)
  const [character, setCharacter] = useState(null)
  const [bankAccount, setBankAccount] = useState(null)
  const [houses, setHouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showUI, setShowUI] = useState(true)

  // Simple WASD state
  const [keys, setKeys] = useState({})
  const [playerPosition, setPlayerPosition] = useState({ x: 0, z: 0 })

  // Load game state on component mount
  useEffect(() => {
    loadGameState()
  }, [])

  const loadGameState = async () => {
    try {
      console.log('Loading game state...')

      // First seed the database with houses if needed
      try {
        const seedResponse = await fetch('/api/seed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (seedResponse.ok) {
          const seedData = await seedResponse.json()
          console.log('Seed response:', seedData.message)
        }
      } catch (seedError) {
        console.log('Seed request failed (may be normal):', seedError.message)
      }

      const response = await fetch('/api/game/state', {
        credentials: 'include'
      })

      console.log('Game state response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Game state data:', data)
        const { gameState } = data
        
        // If no character exists, create one
        if (!gameState.character) {
          console.log('No character found, creating default character')
          await createDefaultCharacter()
          return
        }

        setGameState(gameState)
        setCharacter(gameState.character)
        setBankAccount(gameState.bankAccount)
        setHouses(gameState.houses || [])
        setPlayerPosition({ x: gameState.character.x || 0, z: gameState.character.y || 0 })
        console.log('Game state loaded successfully')
      } else {
        const errorData = await response.json()
        console.log('Game state error:', errorData)
        if (response.status === 401) {
          setError('Authentication failed. Please log in again.')
        } else {
          setError(errorData.error || 'Failed to load game state')
        }
      }
    } catch (err) {
      console.error('Error loading game state:', err)
      setError(`Failed to load game state: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const createDefaultCharacter = async () => {
    try {
      const response = await fetch('/api/game/character', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          name: 'Player',
          gender: 'male'
        })
      })

      if (response.ok) {
        // Reload game state after character creation
        await loadGameState()
      } else {
        const errorData = await response.json()
        setError(`Failed to create character: ${errorData.error}`)
        setLoading(false)
      }
    } catch (err) {
      setError(`Failed to create character: ${err.message}`)
      setLoading(false)
    }
  }

  const updatePlayerPosition = async (newX, newZ) => {
    try {
      await fetch('/api/game/character', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ x: newX, y: newZ })
      })
    } catch (err) {
      console.error('Failed to update position:', err)
    }
  }

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeys((k) => ({ ...k, [e.key.toLowerCase()]: true }))
      // Toggle UI with Tab key
      if (e.key === 'Tab') {
        e.preventDefault()
        setShowUI(prev => !prev)
      }
    }
    const handleKeyUp = (e) => setKeys((k) => ({ ...k, [e.key.toLowerCase()]: false }))
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Player movement
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && character) {
        const pos = playerRef.current.position
        let moved = false
        
        if (keys.w || keys.arrowup) {
          pos.z -= speed
          moved = true
        }
        if (keys.s || keys.arrowdown) {
          pos.z += speed
          moved = true
        }
        if (keys.a || keys.arrowleft) {
          pos.x -= speed
          moved = true
        }
        if (keys.d || keys.arrowright) {
          pos.x += speed
          moved = true
        }

        if (moved) {
          setPlayerPosition({ x: pos.x, z: pos.z })
          // Update position in database (throttled)
          if (Math.random() < 0.1) { // Only update 10% of the time to reduce API calls
            updatePlayerPosition(pos.x, pos.z)
          }
        }
      }
    }, 16)
    return () => clearInterval(interval)
  }, [keys, character])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading your world...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-screen relative">
      {/* 3D World */}
      <Canvas camera={{ position: [0, 8, 12], fov: 50 }}>
        {/* Lights */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        {/* Ground */}
        <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#4ade80" />
        </Plane>

        {/* Trees for decoration */}
        <Tree position={[-25, 0, -15]} size={1.2} />
        <Tree position={[-20, 0, -20]} size={0.8} />
        <Tree position={[25, 0, -10]} size={1.0} />
        <Tree position={[30, 0, -25]} size={1.4} />
        <Tree position={[-30, 0, 20]} size={1.1} />
        <Tree position={[35, 0, 25]} size={0.9} />

        {/* Roads connecting different areas */}
        <Road startPosition={[-40, 0, 0]} endPosition={[40, 0, 0]} width={3} />
        <Road startPosition={[0, 0, -30]} endPosition={[0, 0, 30]} width={2.5} />
        <Road startPosition={[-20, 0, 10]} endPosition={[20, 0, 10]} width={2} />

        {/* Commercial buildings */}
        <Building 
          position={[-15, 0, -10]} 
          type="bank" 
          name="ECountry Bank" 
          color="#2563eb"
        />
        <Building 
          position={[15, 0, -8]} 
          type="shop" 
          name="General Store" 
          color="#dc2626"
        />
        <Building 
          position={[-25, 0, 0]} 
          type="office" 
          name="City Hall" 
          color="#059669"
        />
        <Building 
          position={[25, 0, 2]} 
          type="shop" 
          name="Market" 
          color="#d97706"
        />

        {/* Houses from database */}
        {houses.map((house, index) => (
          <House 
            key={house.id} 
            position={[index * 8 - 10, 0, 10]}
            house={house}
            onClick={() => console.log('Clicked house:', house.location)}
          />
        ))}

        {/* Player character */}
        <group ref={playerRef} position={[playerPosition.x, 0, playerPosition.z]}>
          <Player 
            position={[0, 0, 0]}
            character={character}
            isMoving={keys.w || keys.s || keys.a || keys.d || keys.arrowup || keys.arrowdown || keys.arrowleft || keys.arrowright}
          />
        </group>

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>

      {/* Game UI Overlay */}
      {showUI && (
        <div className="absolute top-0 left-0 p-4 space-y-4 bg-black bg-opacity-50 text-white">
          {/* Player Info */}
          <Card className="w-64 bg-gray-900 text-white border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Player Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>Name: {character?.name}</div>
              <div>Position: ({playerPosition.x.toFixed(1)}, {playerPosition.z.toFixed(1)})</div>
              <div className="text-green-400">Balance: ${bankAccount?.balance}</div>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card className="w-64 bg-gray-900 text-white border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Controls</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-1">
              <div>WASD / Arrow Keys: Move</div>
              <div>Mouse: Look around</div>
              <div>Tab: Toggle UI</div>
              <div>Scroll: Zoom</div>
            </CardContent>
          </Card>

          {/* Available Houses */}
          {houses.length > 0 && (
            <Card className="w-64 bg-gray-900 text-white border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Properties</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-1">
                {houses.slice(0, 3).map(house => (
                  <div key={house.id} className="flex justify-between">
                    <span>{house.location}</span>
                    <span className={house.status === 'AVAILABLE' ? 'text-green-400' : 'text-red-400'}>
                      ${house.price}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="absolute bottom-4 right-4 space-x-2">
        <Button 
          onClick={() => router.push('/test-models')}
          variant="outline"
          size="sm"
        >
          Test Models
        </Button>
        <Button 
          onClick={() => router.push('/dashboard')}
          variant="outline"
          size="sm"
        >
          Dashboard
        </Button>
      </div>

      {/* Welcome Message */}
      {character && (
        <div className="absolute top-4 right-4">
          <Card className="bg-green-900 text-white border-green-700">
            <CardContent className="py-2">
              <p className="text-sm">Welcome to ECountry, {character.name}!</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

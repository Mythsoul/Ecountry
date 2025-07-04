'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import api from '@/helpers/api'

export default function TestModels() {
  const [testResults, setTestResults] = useState([])
  const [isRunning, setIsRunning] = useState(false)

  const addResult = (test, success, message, data = null) => {
    setTestResults(prev => [...prev, { test, success, message, data, timestamp: new Date() }])
  }

  const runTests = async () => {
    setIsRunning(true)
    setTestResults([])
    
    try {
      // Test 1: Create Character
      addResult('Character Creation', null, 'Testing character creation...')
      try {
        const characterResponse = await api.post('/api/game/character', {
          name: 'TestHero',
          gender: 'male',
          avatarUrl: 'https://example.com/avatar.jpg'
        })
        const characterData = await characterResponse.json()
        
        if (characterResponse.ok) {
          addResult('Character Creation', true, 'Character created successfully', characterData.character)
        } else if (characterData.error === 'Character already exists') {
          addResult('Character Creation', true, 'Character already exists (expected)', null)
        } else {
          addResult('Character Creation', false, characterData.error)
        }
      } catch (error) {
        addResult('Character Creation', false, error.message)
      }

      // Test 2: Get Character
      addResult('Character Retrieval', null, 'Testing character retrieval...')
      try {
        const getCharacterResponse = await api.get('/api/game/character')
        const getCharacterData = await getCharacterResponse.json()
        
        if (getCharacterResponse.ok) {
          addResult('Character Retrieval', true, 'Character retrieved successfully', getCharacterData.character)
        } else {
          addResult('Character Retrieval', false, getCharacterData.error)
        }
      } catch (error) {
        addResult('Character Retrieval', false, error.message)
      }

      // Test 3: Update Character Position
      addResult('Position Update', null, 'Testing position update...')
      try {
        const updatePositionResponse = await api.put('/api/game/character', { x: 10.5, y: 20.3 })
        const updatePositionData = await updatePositionResponse.json()
        
        if (updatePositionResponse.ok) {
          addResult('Position Update', true, `Position updated to (${updatePositionData.character.x}, ${updatePositionData.character.y})`)
        } else {
          addResult('Position Update', false, updatePositionData.error)
        }
      } catch (error) {
        addResult('Position Update', false, error.message)
      }

      // Test 4: Get Bank Account
      addResult('Bank Account', null, 'Testing bank account retrieval...')
      try {
        const bankResponse = await api.get('/api/game/bank')
        const bankData = await bankResponse.json()
        
        if (bankResponse.ok) {
          addResult('Bank Account', true, `Bank balance: $${bankData.bankAccount.balance}`, bankData.bankAccount)
        } else {
          addResult('Bank Account', false, bankData.error)
        }
      } catch (error) {
        addResult('Bank Account', false, error.message)
      }

      // Test 5: Update Bank Balance
      addResult('Bank Update', null, 'Testing bank balance update...')
      try {
        const updateBankResponse = await api.put('/api/game/bank', { amount: 500, operation: 'add' })
        const updateBankData = await updateBankResponse.json()
        
        if (updateBankResponse.ok) {
          addResult('Bank Update', true, `New balance: $${updateBankData.bankAccount.balance}`)
        } else {
          addResult('Bank Update', false, updateBankData.error)
        }
      } catch (error) {
        addResult('Bank Update', false, error.message)
      }

      // Test 6: Get Complete Game State
      addResult('Game State', null, 'Testing complete game state retrieval...')
      try {
        const gameStateResponse = await api.get('/api/game/state')
        const gameStateData = await gameStateResponse.json()
        
        if (gameStateResponse.ok) {
          const { gameState } = gameStateData
          const summary = `Character: ${gameState.character?.name || 'None'}, Balance: $${gameState.bankAccount?.balance || 0}, Houses: ${gameState.houses?.length || 0}, Jobs: ${gameState.jobs?.length || 0}, Items: ${gameState.inventory?.length || 0}`
          addResult('Game State', true, summary, gameState)
        } else {
          addResult('Game State', false, gameStateData.error)
        }
      } catch (error) {
        addResult('Game State', false, error.message)
      }

      addResult('All Tests', true, 'All tests completed!')
      
    } catch (error) {
      addResult('Test Suite', false, `Test suite failed: ${error.message}`)
    }
    
    setIsRunning(false)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Game Models Test Suite</CardTitle>
          <CardDescription>
            Test the backend game models to ensure they're working correctly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {testResults.map((result, index) => (
          <Card key={index} className={`
            ${result.success === true ? 'border-green-500 bg-green-50' : 
              result.success === false ? 'border-red-500 bg-red-50' : 
              'border-yellow-500 bg-yellow-50'}
          `}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">
                  {result.test}
                </CardTitle>
                <span className={`text-xs px-2 py-1 rounded ${
                  result.success === true ? 'bg-green-200 text-green-800' :
                  result.success === false ? 'bg-red-200 text-red-800' :
                  'bg-yellow-200 text-yellow-800'
                }`}>
                  {result.success === true ? '✅ PASS' : 
                   result.success === false ? '❌ FAIL' : 
                   '⏳ RUNNING'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-700 mb-2">{result.message}</p>
              {result.data && (
                <details className="text-xs bg-gray-100 p-2 rounded mt-2">
                  <summary className="cursor-pointer font-semibold">View Data</summary>
                  <pre className="mt-2 overflow-x-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {result.timestamp.toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {testResults.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">Click "Run All Tests" to start testing your game models</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

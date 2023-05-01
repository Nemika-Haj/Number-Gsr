import { Flex, Text, Input, HStack, Button, PinInput, PinInputField, Box, Checkbox } from "@chakra-ui/react"
import { useState } from "react"

import "./App.css"
import _ from "lodash"

function determineGuessColor(correctNumber: string, guess: string, index: number): string {
  console.log(correctNumber, guess, index)
  if(correctNumber.charAt(index) == guess.charAt(index)) return "green"
  if(correctNumber.includes(guess.charAt(index))) return "orange"
  return "red"
}

export default function App() {
  const [gameState, setGameState] = useState<number>(0)
  const [correctNumber, setCorrectNumber] = useState<number | null>(null)
  const [currentTries, setCurrentTries] = useState<number[]>([])
  const [maxTries, setMaxTries] = useState<number>(10)
  const [guess, setGuess] = useState<string>("")
  const [easyMode, setEasyMode] = useState<boolean>(false)

  const [wins, setWins] = useState<number>(0)
  const [loses, setLoses] = useState<number>(0)

  return (
    <Flex
      minH="100vh"
      w="100vw"
      maxW="100vw"
      className="bg"
      direction="column"
      alignItems="center"
      p={5}
      position="relative"
    >
      <Text
        fontWeight="semibold"
        fontSize="6xl"
      >
        Number Gsr
      </Text>
      {gameState == 0 && (
        <>
          <Flex direction="column" p={5} alignItems={"center"} gap={5}>
            <HStack>
              <Text>Tries: </Text>
              <Input type="number" defaultValue={maxTries} variant="flushed" w="30px" textAlign="center" onChange={(e) => {
                const value = parseInt(e.target.value)
                if (value < 1) e.target.value = "1"
                if (value > 20) e.target.value = "20"

                setMaxTries(parseInt(e.target.value))
              }} />
            </HStack>
            <HStack>
              <Text>Easy Mode:</Text>
              <Checkbox isChecked={easyMode} onChange={(e) => setEasyMode(e.target.checked)} />
            </HStack>
          </Flex>

          <Button colorScheme="green" onClick={() => {
            setGameState(1)
            setCurrentTries([])
            setGuess("")
            const randNum = parseInt(_.sampleSize("123456789", 4).join(""))
            setCorrectNumber(randNum)
            console.log(randNum)
          }}>START</Button>
        </>
      )}

      {gameState == 1 && (
        <Flex
          direction="column"
          p={5}
          gap={3}
        >
          <HStack>
            <Text flex="4">Your Guesses</Text>
            <Text flex="1" fontSize="xs">Correct Numbers</Text>
            <Text flex="1" fontSize="xs">Correct Positions</Text>
          </HStack>

          {currentTries.map(attempt => {
            const correctNumbers = Array.from(attempt.toString()).filter(digit => correctNumber?.toString().includes(digit)).length
            const correctPositions = Array.from(attempt.toString()).filter((digit, index) => correctNumber?.toString().charAt(index) == digit).length

            return (
              <HStack gap={5} key={attempt.toString() + "-attempt"}>
                <HStack>
                  <PinInput isDisabled value={attempt.toString() + 2 + 3} size="lg">
                    <PinInputField borderColor={easyMode ? determineGuessColor((correctNumber || "").toString(), attempt.toString(), 0) : "red"} />
                    <PinInputField borderColor={easyMode ? determineGuessColor((correctNumber || "").toString(), attempt.toString(), 1) : "red"} />
                    <PinInputField borderColor={easyMode ? determineGuessColor((correctNumber || "").toString(), attempt.toString(), 2) : "red"} />
                    <PinInputField borderColor={easyMode ? determineGuessColor((correctNumber || "").toString(), attempt.toString(), 3) : "red"} />
                  </PinInput>
                </HStack>

                <HStack gap={2}>
                  <PinInput isDisabled value={`${correctNumbers}${correctPositions}`} size="lg">
                    <PinInputField />
                    <PinInputField />
                  </PinInput>
                </HStack>
              </HStack>
            )
          })}
          <HStack gap={5}>
            <HStack>
              <PinInput size="lg" type="number" value={guess} otp onChange={value => {
                setGuess(value)
                if (value.length == 4) {
                  if (!currentTries.includes(parseInt(value))) {
                    setGuess("")
                    if (parseInt(value) == correctNumber) {
                      setGameState(2)
                      setWins(wins + 1)
                    } else if (maxTries <= currentTries.length) {
                      setGameState(3)
                      setLoses(loses + 1)
                    }
                    setCurrentTries([...currentTries, parseInt(value)])
                  } else {
                    setGuess("")
                  }
                }
              }}>
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>

            </HStack>
            <HStack gap={2}>
              <PinInput isDisabled size="lg">
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
          </HStack>
        </Flex>
      )}

      {gameState == 2 && (
        <>
          <Text
            fontWeight="semibold"
            fontSize="6xl"
          >
            You won! The number was {correctNumber}
          </Text>
          <Button colorScheme="green" onClick={() => setGameState(0)}>TRY AGAIN</Button>
        </>
      )}

      {gameState == 3 && (
        <>
          <Text
            fontWeight="semibold"
            fontSize="6xl"
          >
            You lost! The number was {correctNumber}
          </Text>
          <Button colorScheme="green" onClick={() => setGameState(0)}>TRY AGAIN</Button>
        </>
      )}

      <Box
        position="absolute"
        top="5px"
        right="5px"
      >
        <Text>Wins: {wins}</Text>
        <Text>Loses: {loses}</Text>
      </Box>
    </Flex>
  )

}
import { Flex, Text, Input, HStack, Button, PinInput, PinInputField, Box, Checkbox } from "@chakra-ui/react"
import { useEffect, useState } from "react"

import JSConfetti from "js-confetti"

import "./App.css"
import _ from "lodash"

function determineGuessColor(correctNumber: string, guess: string, index: number): string {
  if(correctNumber.charAt(index) == guess.charAt(index)) return "green"
  if(correctNumber.includes(guess.charAt(index))) return "orange"
  return "red"
}

export default function App() {
  const [gameState, setGameState] = useState<number>(0)
  const [correctNumber, setCorrectNumber] = useState<number | null>(null)
  const [currentTries, setCurrentTries] = useState<number[]>([])
  const [maxTries, setMaxTries] = useState<number>(10)
  const [numberLength, setNumberLength] = useState<number>(4)
  const [guess, setGuess] = useState<string>("")
  const [easyMode, setEasyMode] = useState<boolean>(false)

  const [wins, setWins] = useState<number>(0)
  const [loses, setLoses] = useState<number>(0)

  
  useEffect(() => {
    const confetti = new JSConfetti()
    if(gameState == 2) {
      for(let i = 0; i < 10; i++) {
        setTimeout(() => confetti.addConfetti({
          emojis: Array.from("➕➖➗🧠📱🔢🧮"),
        }), i*1000)
      }
    } else if(gameState == 3) {
      for(let i = 0; i < 10; i++) {
        setTimeout(() => confetti.addConfetti({
          emojis: Array.from("👎💥👢📑📚🧾🥾"),
        }), i*1000)
      }
    }
  }, [gameState])

  return (
    <Flex
      minH="100vh"
      maxW="100vw"
      className={gameState == 1 ? "bg-playing" : gameState == 3 ? "bg-lost" : "bg"}
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
              <Text>Number Digits: </Text>
              <Input type="number" defaultValue={numberLength} variant="flushed" w="30px" textAlign="center" onChange={(e) => {
                const value = parseInt(e.target.value)
                if (value < 1) e.target.value = "1"
                if (value > 9) e.target.value = "9"

                setNumberLength(parseInt(e.target.value))
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
            const randNum = parseInt(_.sampleSize("123456789", numberLength).join(""))
            setCorrectNumber(randNum)
          }}>START</Button>

          <br />
          <br />
          <br />

          <Text fontSize="3xl">How to play:</Text>
          <Text maxW="600px" p={2} fontSize="sm" color="gray.300">{"Number Gsr is a simple number guessing game. Your goal is to guess an n-digit number within a set amount of attempts. The number contains unique digits (each number can appear once), and the digits it contains range from 1 to 9, so 0 is not included. After each incorrect guess, you will be told how many numbers you've guessed correctly, and how many of them are in the correct positions. However, you won't be told what the precise numbers are, unless you enable Easy Mode. If Easy Mode is enabled, correct numbers will be highlighted with an orange border, and if they also happen to be in the correct position, the border will turn green. The win/lose ratio can be seen at the top-right of the page. Good luck :)"}</Text>
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
                    {Array(numberLength).fill(true).map((_, index) => <PinInputField key={"guess-"+attempt.toString()+index} borderColor={easyMode ? determineGuessColor((correctNumber || "").toString(), attempt.toString(), index) : "red"} />)}
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
                if (value.length == numberLength) {
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
                {Array(numberLength).fill(true).map((_, index) => <PinInputField key={"input-"+index} />)}
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
            fontWeight="medium"
            fontSize="2xl"
            mb={5}
          >
            You won! The number was {correctNumber}
          </Text>
          <Button colorScheme="green" onClick={() => setGameState(0)}>TRY AGAIN</Button>
        </>
      )}

      {gameState == 3 && (
        <>
          <Text
            fontWeight="medium"
            fontSize="2xl"
            mb={5}
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
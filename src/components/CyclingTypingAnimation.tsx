import { useState, useEffect } from 'react'

const phrases = [
  "80% Fewer Tokens",
  "Intelligent Data Pre-Processing", 
  "Multi-Chart Visualization",
  "Advanced Data Insights"
]

export default function CyclingTypingAnimation() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex]
    
    if (isTyping) {
      if (charIndex < currentPhrase.length) {
        const timer = setTimeout(() => {
          setCurrentText(currentPhrase.slice(0, charIndex + 1))
          setCharIndex(charIndex + 1)
        }, 100)
        return () => clearTimeout(timer)
      } else {
        // Finished typing, wait then start backspacing
        const timer = setTimeout(() => {
          setIsTyping(false)
        }, 2000)
        return () => clearTimeout(timer)
      }
    } else {
      if (charIndex > 0) {
        const timer = setTimeout(() => {
          setCurrentText(currentPhrase.slice(0, charIndex - 1))
          setCharIndex(charIndex - 1)
        }, 50)
        return () => clearTimeout(timer)
      } else {
        // Finished backspacing, move to next phrase
        const timer = setTimeout(() => {
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length)
          setIsTyping(true)
        }, 500)
        return () => clearTimeout(timer)
      }
    }
  }, [currentPhraseIndex, charIndex, isTyping])

  return (
    <div className="flex justify-center w-full">
      <span className="text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
        Using {currentText}
      </span>
    </div>
  )
}

import { useEffect, useState } from "react";
import { container } from "../styles";
import {
  buttonsContainer,
  currentTeamText,
  flexContainer,
  word,
  tileLeftText,
  nextWordBtn,
  skipWordBtn,
} from "./styles";
import { resultsContainer } from "../CurrentResults/styles";

const WORDS = ["apple", "mountain", "doctor", "snow", "river", "jungle"];

function Round({ onRoundEnd, currentTeam }) {
  const [timeLeft, setTimeLeft] = useState(10);
  const [currentWord, setCurrentWord] = useState("");
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    setCurrentWord(getRandomWord());
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      onRoundEnd(correctCount);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, correctCount, onRoundEnd]);

  const getRandomWord = () => {
    const index = Math.floor(Math.random() * WORDS.length);
    return WORDS[index];
  };

  const correctWord = () => {
    setCorrectCount((c) => c + 1);
    setCurrentWord(getRandomWord());
  };

  const skipWord = () => {
    setCurrentWord(getRandomWord());
  };

  return (
    <div style={container}>
      <h1 style={{ ...resultsContainer, ...currentTeamText }}>Team: {currentTeam.name}</h1>
      <div style={flexContainer}>
        <p>
          Time Left:
          <span style={tileLeftText}> {timeLeft}s</span>
        </p>
        <div style={word}>{currentWord}</div>
      </div>

      <div style={buttonsContainer}>
        <button style={nextWordBtn} onClick={correctWord}>
          Next Word
        </button>
        <button style={skipWordBtn} onClick={skipWord}>
          Skip
        </button>
      </div>
    </div>
  );
}

export default Round;

import { useEffect, useState } from "react";
import { container } from "../styles";
import { resultsContainer } from "../CurrentResults/styles";
import {
  buttonsContainer,
  currentTeamText,
  flexContainer,
  word,
  tileLeftText,
  nextWordBtn,
  skipWordBtn,
} from "./styles";

function Round({ onRoundEnd, currentTeam, getNextWord }) {
  const [timeLeft, setTimeLeft] = useState(7);
  const [currentWord, setCurrentWord] = useState("");
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    const nextWord = getNextWord();
    setCurrentWord(nextWord);
  }, [getNextWord]);

  useEffect(() => {
    if (timeLeft === 0) {
      onRoundEnd(correctCount);
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onRoundEnd]);

  const correctWord = () => {
    setCorrectCount((c) => c + 1);
    setCurrentWord(getNextWord());
  };

  const skipWord = () => {
    setCurrentWord(getNextWord());
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

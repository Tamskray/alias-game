import { useEffect, useState } from "react";
import useSoundPlayer from "../../../hooks/useSoundPlayer";
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
  currentCountText,
} from "./styles";

import nextWordSound from "../../../assets/next-word.mp3";
import skipWordSound from "../../../assets/skip-word2.mp3";
import roundOverSound from "../../../assets/time-over.mp3";
import wowSound from "../../../assets/wow.mp3";

function Round({ onRoundEnd, currentTeam, getNextWord }) {
  const [timeLeft, setTimeLeft] = useState(16);
  const [currentWord, setCurrentWord] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [roundOverPending, setRoundOverPending] = useState(false);

  const playSound = useSoundPlayer();

  useEffect(() => {
    const nextWord = getNextWord();
    setCurrentWord(nextWord);
  }, [getNextWord]);

  useEffect(() => {
    if (timeLeft === 0) {
      // onRoundEnd(correctCount);
      setRoundOverPending(true);
      return;
    }

    if (!roundOverPending) {
      const intervalId = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [timeLeft, onRoundEnd, roundOverPending]);

  useEffect(() => {
    if (timeLeft === 9) {
      playSound(roundOverSound);
    }
  }, [timeLeft, playSound]);

  useEffect(() => {
    if (correctCount === 10) playSound(wowSound);
  }, [correctCount]);

  const correctWord = () => {
    playSound(nextWordSound);

    if (roundOverPending) {
      setCorrectCount((c) => {
        const newCount = c + 1;
        onRoundEnd(newCount);
        return newCount;
      });
    } else {
      setCorrectCount((c) => c + 1);
      const nextWord = getNextWord();
      setCurrentWord(nextWord);
    }
  };

  const skipWord = () => {
    playSound(skipWordSound);
    setCorrectCount((c) => c - 1);
    setCurrentWord(getNextWord());
  };

  return (
    <div style={container}>
      <h1 style={{ ...resultsContainer, ...currentTeamText }}>Team: {currentTeam.name}</h1>

      <div style={flexContainer}>
        <div style={currentCountText}>{correctCount}</div>
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
        {!roundOverPending && (
          <button style={skipWordBtn} onClick={skipWord} disabled={roundOverPending}>
            Skip
          </button>
        )}
      </div>
    </div>
  );
}

export default Round;

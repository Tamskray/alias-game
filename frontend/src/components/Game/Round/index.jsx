import { useEffect, useState } from "react";

const WORDS = ["apple", "mountain", "doctor", "snow", "river", "jungle"];

function Round({ onRoundEnd, currentTeam }) {
  const [timeLeft, setTimeLeft] = useState(5);
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
    <div>
      <h2>Team: {currentTeam.name}</h2>
      <p>Time Left: {timeLeft}s</p>
      <h3>{currentWord}</h3>

      <button onClick={correctWord}>Next Word</button>
      <button onClick={skipWord}>Skip</button>
    </div>
  );
}

export default Round;

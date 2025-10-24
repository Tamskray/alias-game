import { useRef, useState } from "react";

import CurrentResults from "./CurrentResults";
import Round from "./Round";
import { buttonContainer, container } from "./styles";
import { WORDS } from "./words";
import { currentTeamText, scoreText } from "./CurrentResults/styles";
import useSoundPlayer from "../../hooks/useSoundPlayer";

import startRoundSound from "../../assets/game-start.mp3";
import winSound from "../../assets/win.mp3";

export const WINNING_SCORE = 50;
const TEAM_LEAD = 1;

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function Game({ teams }) {
  const [teamsState, setTeamsState] = useState(teams);
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [isRoundActive, setIsRoundActive] = useState(false);
  const [someoneReachedThreshold, setSomeoneReachedThreshold] = useState(false);
  const [winner, setWinner] = useState(null);

  const playSound = useSoundPlayer();

  const [wordsShuffled, setWordsShuffled] = useState(() => shuffleArray(WORDS));
  const currentWordIndexRef = useRef(0);
  const usedWordsRef = useRef(new Set());
  console.log(usedWordsRef);

  const getNextWord = () => {
    if (currentWordIndexRef.current >= wordsShuffled.length) {
      const reshuffled = shuffleArray(WORDS);
      setWordsShuffled(reshuffled);
      currentWordIndexRef.current = 0;
      usedWordsRef.current.clear();
    }

    const chosen = wordsShuffled[currentWordIndexRef.current];
    usedWordsRef.current.add(chosen);
    currentWordIndexRef.current += 1;

    return chosen;
  };

  const handleRoundEnd = (correctWordsCount) => {
    const prevTeams = teamsState;
    const updated = prevTeams.map((teams) => ({ ...teams }));

    updated[activeTeamIndex].score += correctWordsCount;
    updated[activeTeamIndex].roundsPlayed += 1;

    const currentCycle = Math.min(...prevTeams.map((team) => team.roundsPlayed));
    const allFinishedCycle = updated.every((team) => team.roundsPlayed > currentCycle);

    const isSomeoneReached =
      someoneReachedThreshold || updated[activeTeamIndex].score >= WINNING_SCORE;

    setTeamsState(updated);

    if (isSomeoneReached && allFinishedCycle) {
      const sorted = [...updated].sort((a, b) => b.score - a.score);
      const topScore = sorted[0].score;
      const secondScore = sorted[1] ? sorted[1].score : 0;

      if (topScore >= WINNING_SCORE && topScore - secondScore >= TEAM_LEAD) {
        const winnerTeam = updated.find((team) => team.id === sorted[0].id);
        setWinner(winnerTeam);
        playSound(winSound);

        return;
      }

      const overtimeTeams = updated.filter((team) => team.score >= secondScore);

      if (overtimeTeams.length === 1) {
        setWinner(overtimeTeams[0]);
        playSound(winSound);
        return;
      }

      const resetOvertimeTeams = overtimeTeams.map((teams) => ({
        ...teams,
        roundsPlayed: 0,
      }));

      setTeamsState(resetOvertimeTeams);
      setActiveTeamIndex(0);
      setSomeoneReachedThreshold(false);
      setIsRoundActive(false);
      return;
    }

    setActiveTeamIndex((activeTeamIndex + 1) % teamsState.length);
    setSomeoneReachedThreshold(isSomeoneReached);
    setIsRoundActive(false);
  };

  const onRoundStart = () => {
    setIsRoundActive(true);
    playSound(startRoundSound);
  };

  const onRestart = () => {
    setWinner(null);
    setTeamsState(teams.map((team) => ({ ...team, score: 0, roundsPlayed: 0 })));
    setActiveTeamIndex(0);
    setSomeoneReachedThreshold(false);
    setIsRoundActive(false);
  };

  if (winner) {
    return (
      <div>
        <h1> Winner! </h1>
        <h2 style={currentTeamText}>{winner.name} wins the game!</h2>
        <p style={scoreText}>
          <b>Score: {winner.score}</b>
        </p>

        <button onClick={onRestart}>Restart</button>

        <CurrentResults teams={teamsState} />
      </div>
    );
  }

  return (
    <div>
      {isRoundActive ? (
        <Round
          onRoundEnd={handleRoundEnd}
          currentTeam={teamsState[activeTeamIndex]}
          getNextWord={getNextWord}
        />
      ) : (
        <div style={container}>
          <CurrentResults teams={teamsState} />
          <div style={buttonContainer}>
            <p style={currentTeamText}>
              Current Team: <b>{teamsState[activeTeamIndex].name}</b>
            </p>
            <button onClick={onRoundStart}>Start Round</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;

import { useState } from "react";

import CurrentResults from "./CurrentResults";
import Round from "./Round";

const WINNING_SCORE = 10;
const TEAM_LEAD = 1;

function Game({ teams }) {
  const [teamsState, setTeamsState] = useState(teams);
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [isRoundActive, setIsRoundActive] = useState(false);
  const [someoneReachedThreshold, setSomeoneReachedThreshold] = useState(false);
  const [winner, setWinner] = useState(null);

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
        return;
      }

      const overtimeTeams = updated.filter((team) => team.score >= secondScore);

      if (overtimeTeams.length === 1) {
        setWinner(overtimeTeams[0]);
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

  if (winner) {
    return (
      <div>
        <h1> Winner! </h1>
        <h2>{winner.name} wins the game!</h2>
        <p>Score: {winner.score}</p>

        <CurrentResults teams={teamsState} />
      </div>
    );
  }

  return (
    <div>
      <h1>Game</h1>

      {!isRoundActive ? (
        <>
          <CurrentResults teams={teamsState} />
          <p>
            Current Team: <b>{teamsState[activeTeamIndex].name}</b>
          </p>
          <button onClick={() => setIsRoundActive(true)}>Start Round</button>
        </>
      ) : (
        <Round onRoundEnd={handleRoundEnd} currentTeam={teamsState[activeTeamIndex]} />
      )}
    </div>
  );
}

export default Game;

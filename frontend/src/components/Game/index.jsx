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
    // Copy current state (safe snapshot)
    const prev = teamsState;
    const updated = prev.map((t) => ({ ...t }));

    // 1) Update current team's score and roundsPlayed
    updated[activeTeamIndex].score += correctWordsCount;
    updated[activeTeamIndex].roundsPlayed += 1;

    // 2) Compute cycle start (the number of rounds that everyone had before this round)
    const cycleStart = Math.min(...prev.map((t) => t.roundsPlayed));

    // 3) Check if after this increment all teams have played this cycle (i.e. roundsPlayed > cycleStart)
    const allFinishedCycle = updated.every((t) => t.roundsPlayed > cycleStart);

    // 4) Determine if someone reached the threshold during this update
    const reachedNow = updated[activeTeamIndex].score >= WINNING_SCORE;
    const someoneReached = someoneReachedThreshold || reachedNow;

    console.log(updated);
    // Persist updated teams
    setTeamsState(updated);

    // 5) If final cycle was triggered AND full cycle finished => evaluate winner / overtime
    if (someoneReached && allFinishedCycle) {
      // Determine winner or overtime group
      const sorted = [...updated].sort((a, b) => b.score - a.score);
      const topScore = sorted[0].score;
      const secondScore = sorted[1] ? sorted[1].score : 0;

      // If top meets threshold and leads by >= 2 -> winner
      if (topScore >= WINNING_SCORE && topScore - secondScore >= TEAM_LEAD) {
        // find the team object from updated (to keep correct score & roundsPlayed)
        const winnerTeam = updated.find((t) => t.id === sorted[0].id);
        setWinner(winnerTeam);
        return;
      }

      // No winner yet → form overtime group.
      // Keep all teams whose score >= secondScore (this preserves ties for second place)
      const overtimeTeams = updated.filter((t) => t.score >= secondScore);

      // If only one team left in overtime -> that team wins
      if (overtimeTeams.length === 1) {
        setWinner(overtimeTeams[0]);
        return;
      }

      // Otherwise reset roundsPlayed for overtime teams and continue with them
      const resetOvertimeTeams = overtimeTeams.map((t) => ({
        ...t,
        roundsPlayed: 0,
      }));

      setTeamsState(resetOvertimeTeams);
      setActiveTeamIndex(0);
      setSomeoneReachedThreshold(false); // start new cycles for overtime
      setIsRoundActive(false);
      return;
    }

    // 6) Otherwise — continue normal flow: go to next team in the current teams list
    const nextIndex = (activeTeamIndex + 1) % teamsState.length;
    setActiveTeamIndex(nextIndex);
    setSomeoneReachedThreshold(someoneReached);
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
        <Round
          onRoundEnd={handleRoundEnd}
          currentTeam={teamsState[activeTeamIndex]}
        />
      )}
    </div>
  );
}

export default Game;

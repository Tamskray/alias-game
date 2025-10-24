import { WINNING_SCORE } from "..";

import {
  currentTeamText,
  flexRow,
  resultsContainer,
  scoreText,
  teamGradients,
  teamStyles,
} from "./styles";

function CurrentResults({ teams }) {
  return (
    <div style={resultsContainer}>
      <div style={currentTeamText}>
        To win: <b>{WINNING_SCORE}</b>
      </div>
      <div style={flexRow}>
        <h3 style={currentTeamText}>Current Results</h3>
      </div>
      {teams.map((team, index) => (
        <div
          key={team.id}
          style={{
            ...teamStyles,
            background: teamGradients[index % teamGradients.length],
          }}
        >
          {team.name} - <b style={scoreText}>{team.score}</b>
        </div>
      ))}
    </div>
  );
}

export default CurrentResults;

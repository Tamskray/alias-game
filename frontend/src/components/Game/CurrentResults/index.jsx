import { currentTeamText, resultsContainer, scoreText, teamGradients, teamStyles } from "./styles";

function CurrentResults({ teams }) {
  return (
    <div style={resultsContainer}>
      <h3 style={currentTeamText}>Current Results</h3>
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

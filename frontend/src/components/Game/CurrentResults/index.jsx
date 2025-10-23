import { resultsContainer } from "./styles";

function CurrentResults({ teams }) {
  return (
    <div style={resultsContainer}>
      <h3>Current Results</h3>
      {teams.map((team) => (
        <div key={team.id}>
          {team.name} - <b>{team.score}</b>
        </div>
      ))}
    </div>
  );
}

export default CurrentResults;

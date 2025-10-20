function CurrentResults({ teams }) {
  return (
    <div>
      <h2>Current Results</h2>
      {teams.map((team) => (
        <div key={team.id}>
          {team.name} - {team.score}
        </div>
      ))}
    </div>
  );
}

export default CurrentResults;

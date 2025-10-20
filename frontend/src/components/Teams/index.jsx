import { useState } from "react";
import { container } from "./styles";

function Teams({ onSubmitTeams }) {
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [team3, setTeam3] = useState("");

  const handleSubmitTeams = () => {
    const teams = [
      { id: `1${team1}`, name: team1, score: 0, roundsPlayed: 0 },
      { id: `2${team2}`, name: team2, score: 0, roundsPlayed: 0 },
      { id: `3${team3}`, name: team3, score: 0, roundsPlayed: 0 },
    ].filter((t) => t.name.trim() !== "");

    onSubmitTeams(teams);
  };

  return (
    <div style={container}>
      <h1>Choose Teams</h1>
      <input
        type="text"
        placeholder="Team 1 Name"
        value={team1}
        onChange={(e) => setTeam1(e.target.value)}
      />
      <input
        type="text"
        placeholder="Team 2 Name"
        value={team2}
        onChange={(e) => setTeam2(e.target.value)}
      />
      <input
        type="text"
        placeholder="Team 3 Name"
        value={team3}
        onChange={(e) => setTeam3(e.target.value)}
      />
      <button onClick={handleSubmitTeams}>Start Game</button>
    </div>
  );
}

export default Teams;

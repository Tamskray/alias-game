import { useState } from "react";

import Teams from "./components/Teams";
import Game from "./components/Game";

import "./App.css";

function App() {
  const [isTeamsChosen, setIsTeamsChosen] = useState(false);
  const [teams, setTeams] = useState([]);

  const onSubmitTeams = (selectedTeams) => {
    setTeams(selectedTeams);
    setIsTeamsChosen(true);
  };

  return <>{isTeamsChosen ? <Game teams={teams} /> : <Teams onSubmitTeams={onSubmitTeams} />}</>;
}

export default App;

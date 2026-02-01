import { useEffect, useState } from "react";
import {
  getUserGames,
  addGame,
  updateGame,
  deleteGame,
} from "../services/gamesService";

import GameList from "../components/GameList";
import GameForm from "../components/GameForm";
import GameDetail from "../components/GameDetail";

export default function Ludoteca({ user }) {
  const [games, setGames] = useState([]);
  const [view, setView] = useState("list");
  const [viewMode, setViewMode] = useState("cards");
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    loadGames();
  }, []);

  async function loadGames() {
    const data = await getUserGames(user.uid);
    setGames(data);
  }

  async function saveGame(game) {
    if (game.id) {
      await updateGame(game.id, game);
    } else {
      await addGame(game, user.uid);
    }
    await loadGames();
    setView("list");
  }

  async function removeGame(id) {
    await deleteGame(id);
    await loadGames();
    setView("list");
  }

  if (view === "create")
    return <GameForm onSave={saveGame} onCancel={() => setView("list")} />;

  if (view === "edit" && selectedGame)
    return (
      <GameForm
        initialGame={selectedGame}
        onSave={saveGame}
        onCancel={() => setView("detail")}
      />
    );

  if (view === "detail" && selectedGame)
    return (
      <GameDetail
        game={selectedGame}
        onBack={() => setView("list")}
        onEdit={() => setView("edit")}
        onDelete={(id) => removeGame(id)}
      />
    );

  return (
    <GameList
      games={games}
      viewMode={viewMode}
      onToggleView={() =>
        setViewMode(v => (v === "cards" ? "list" : "cards"))
      }
      onCreate={() => setView("create")}
      onOpen={(g) => {
        setSelectedGame(g);
        setView("detail");
      }}
    />
  );
}

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
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [viewMode, setViewMode] = useState("cards");
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    loadGames(); // eslint-disable-next-line
  }, []);

  async function loadGames() {
    setLoading(true);
    try {
      const data = await getUserGames(user.uid);
      setGames(data);
    } finally {
      setLoading(false);
    }
  }

  async function saveGame(game) {
    setLoading(true);
    try {
      if (game.id) {
        await updateGame(game.id, game);
      } else {
        await addGame(game, user.uid);
      }
      await loadGames();
      setView("list");
    } finally {
      setLoading(false);
    }
  }

  async function removeGame(id) {
    setLoading(true);
    try {
      await deleteGame(id);
      await loadGames();
      setView("list");
    } finally {
      setLoading(false);
    }
  }

  /* =====================
     Loader bloqueante
  ===================== */
  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <span className="text-sm text-gray-600">🎲 Cargando juegos…</span>
      </div>
    );
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
        setViewMode((v) => (v === "cards" ? "list" : "cards"))
      }
      onCreate={() => setView("create")}
      onOpen={(g) => {
        setSelectedGame(g);
        setView("detail");
      }}
    />
  );
}

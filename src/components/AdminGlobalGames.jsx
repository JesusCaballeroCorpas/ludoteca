import { useState } from "react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

import useGlobalGames from "../hooks/useGlobalGames";
import GameList from "./GameList";
import GameForm from "./GameForm";
import GameDetail from "./GameDetail";

export default function AdminGlobalGames({ onBack }) {
  const { globalGames: games, loading } = useGlobalGames();

  const [view, setView] = useState("list");
  const [selectedGame, setSelectedGame] = useState(null);
  const [viewMode, setViewMode] = useState("cards");

  async function deleteGame(id) {
    if (!window.confirm("¿Seguro que quieres borrar este juego global?"))
      return;

    await deleteDoc(doc(db, "globalGames", id));
    setView("list");
  }

  async function saveGlobalGame(game) {
    await updateDoc(doc(db, "globalGames", game.id), {
      name: game.name,
      minPlayers: game.minPlayers,
      maxPlayers: game.maxPlayers,
      ageMin: game.ageMin,
      ageMax: game.ageMax,
      durationMin: game.durationMin,
      durationMax: game.durationMax,
      image: game.image,
    });

    setView("detail");
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <span className="text-sm text-gray-600">
          🎲 Cargando global games…
        </span>
      </div>
    );
  }

  /* =====================
     VISTA EDITAR
  ===================== */
  if (view === "edit" && selectedGame)
    return (
      <>
        <div className="max-w-4xl mx-auto mt-4">
          <button
            onClick={onBack}
            className="flex-1 border px-3 py-2 rounded"
          >
            ⬅️ Volver a mi ludoteca 
          </button>
        </div>

        <GameForm
          initialGame={selectedGame}
          onSave={saveGlobalGame}
          onCancel={() => setView("detail")}
        />
      </>
    );

  /* =====================
     VISTA DETALLE
  ===================== */
  if (view === "detail" && selectedGame)
    return (
      <>
        <div className="max-w-4xl mx-auto mt-4">
          <button
            onClick={onBack}
            className="flex-1 border px-3 py-2 rounded"
          >
            ⬅️ Volver a mi ludoteca 
          </button>
        </div>

        <GameDetail
          game={selectedGame}
          onBack={() => setView("list")}
          onEdit={() => setView("edit")}
          onDelete={() => deleteGame(selectedGame.id)}
          adminMode={true}
        />
      </>
    );

  /* =====================
     VISTA LISTA
  ===================== */
  return (
    <>
      <div className="max-w-4xl mx-auto mt-4 flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex-1 border px-3 py-2 rounded"
        >
          ⬅️ Volver a mi ludoteca 
        </button>

        <h2 className="text-lg font-semibold">
          Panel Admin · Juegos Globales
        </h2>
      </div>

      <GameList
        games={games}
        viewMode={viewMode}
        onToggleView={() =>
          setViewMode((v) => (v === "cards" ? "list" : "cards"))
        }
        onCreate={null}
        onStats={null}
        onOpen={(g) => {
          setSelectedGame(g);
          setView("detail");
        }}
      />
    </>
  );
}

import { useEffect, useState } from "react";
import MatchesList from "./MatchesList";
import MatchForm from "./MatchForm";
import {
  getMatchesByGame,
  addMatch,
  updateMatch,
  deleteMatch,
} from "../services/matchesService";

/* =====================
   GameDetail
===================== */
export default function GameDetail({ game, onBack, onEdit, onDelete }) {
  const [matches, setMatches] = useState([]);
  const [view, setView] = useState("detail");
  const [editingMatch, setEditingMatch] = useState(null);
  const [confirmingMatchId, setConfirmingMatchId] = useState(null);
  const [confirmingGame, setConfirmingGame] = useState(false);

  // Cargar partidas del juego
  useEffect(() => {
    async function loadMatches() {
      const data = await getMatchesByGame(game.id, game.userId);
      setMatches(data);
    }
    loadMatches();
  }, [game.id, game.userId]);

  // Guardar nueva partida o editar existente
  async function saveMatch(match) {
    if (editingMatch) {
      await updateMatch(editingMatch.id, match);
      setEditingMatch(null);
    } else {
      await addMatch(match, game.id, game.userId);
    }
    setView("detail");
    const data = await getMatchesByGame(game.id, game.userId);
    setMatches(data);
  }

  // Eliminar partida
  async function deleteMatchConfirmed() {
    if (confirmingMatchId) {
      await deleteMatch(confirmingMatchId);
      setConfirmingMatchId(null);
      const data = await getMatchesByGame(game.id, game.userId);
      setMatches(data);
    }
  }

  // Modal para crear o editar partida
  if (view === "create-match" || editingMatch) {
    return (
      <MatchForm
        gameId={game.id}
        userId={game.userId}
        onSave={saveMatch}
        onCancel={() => {
          setView("detail");
          setEditingMatch(null);
        }}
        initialData={editingMatch}
      />
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{game.name}</h1>

      <div className="flex gap-4 mb-6">
        {game.image && (
          <img
            src={game.image}
            alt={game.name}
            className="w-1/2 h-64 object-contain bg-gray-100 rounded"
          />
        )}
        <div className="w-1/2 flex flex-col gap-2">
          <span>👥 {game.minPlayers}-{game.maxPlayers}</span>
          <span>🎂 {game.ageMin}+</span>
          <span>⏱ {game.durationMin} min</span>
        </div>
      </div>

      <p className="text-sm mb-2">Editorial: {game.publisher}</p>
      <p className="mb-6 whitespace-pre-wrap">{game.comments}</p>

      <hr className="my-6" />

      <button
        className="bg-green-600 text-white px-3 py-2 rounded mb-4"
        onClick={() => setView("create-match")}
      >
        ➕ Añadir partida
      </button>

      <h2 className="text-xl font-semibold mb-3">🏁 Partidas</h2>
      <MatchesList
        matches={matches}
        onEdit={(match) => setEditingMatch(match)}
        onDelete={(matchId) => setConfirmingMatchId(matchId)}
      />

      <hr className="my-6" />

      <div className="flex gap-2">
        <button className="border px-4 py-2 rounded" onClick={onBack}>
          Volver
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={onEdit}>
          Editar
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded"
          onClick={() => setConfirmingGame(true)}
        >
          Eliminar
        </button>
      </div>

      {/* Modal de confirmación para partida */}
      {confirmingMatchId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <h2 className="font-semibold mb-4">¿Eliminar partida?</h2>
            <p className="text-sm mb-4">Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-2">
              <button
                className="border px-3 py-2 rounded"
                onClick={() => setConfirmingMatchId(null)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-600 text-white px-3 py-2 rounded"
                onClick={deleteMatchConfirmed}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para juego */}
      {confirmingGame && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <h2 className="font-semibold mb-4">¿Eliminar juego?</h2>
            <p className="text-sm mb-4">Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-2">
              <button
                className="border px-3 py-2 rounded"
                onClick={() => setConfirmingGame(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-600 text-white px-3 py-2 rounded"
                onClick={() => {
                  onDelete(game.id);
                  setConfirmingGame(false);
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

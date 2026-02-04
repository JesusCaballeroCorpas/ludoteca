import { useEffect, useState, useCallback } from "react";
import MatchesList from "./MatchesList";
import MatchForm from "./MatchForm";
import {
  getMatchesByGame,
  addMatch,
  updateMatch,
  deleteMatch,
} from "../services/matchesService";

/* =====================
   Helpers de formato
===================== */
function formatRange(min, max, suffix = "") {
  if (min && max && min !== max) return `${min}-${max}${suffix}`;
  if (min) return `${min}${suffix}`;
  if (max) return `${max}${suffix}`;
  return "";
}

function formatAge(min, max) {
  if (min && max && min !== max) return `${min}-${max}`;
  if (min) return `${min}+`;
  if (max) return `${max}`;
  return "";
}

export default function GameDetail({ game, onBack, onEdit, onDelete }) {
  const [matches, setMatches] = useState([]);
  const [view, setView] = useState("detail");
  const [editingMatch, setEditingMatch] = useState(null);
  const [confirmingMatchId, setConfirmingMatchId] = useState(null);
  const [confirmingGame, setConfirmingGame] = useState(false);

  const loadMatches = useCallback(async () => {
    const data = await getMatchesByGame(game.id, game.userId);
    setMatches(data);
  }, [game.id, game.userId]);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  async function saveMatch(match) {
    if (editingMatch) {
      await updateMatch(editingMatch.id, match);
      setEditingMatch(null);
    } else {
      await addMatch(match, game.id, game.userId);
    }
    setView("detail");
    loadMatches();
  }

  if (view === "create-match" || editingMatch) {
    return (
      <MatchForm
        gameId={game.id}
        userId={game.userId}
        initialData={editingMatch}
        onSave={saveMatch}
        onCancel={() => {
          setEditingMatch(null);
          setView("detail");
        }}
      />
    );
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto px-4 pb-28 md:pb-4">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">{game.name}</h1>

      {/* Info principal */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 w-full">
        {game.image && (
          <img
            src={game.image}
            alt={game.name}
            className="w-full md:w-1/2 h-64 object-contain bg-gray-100 rounded"
          />
        )}

        <div className="w-full md:w-1/2 flex flex-col gap-2 text-sm">
          <span>👥 {formatRange(game.minPlayers, game.maxPlayers)}</span>
          <span>🎂 {formatAge(game.ageMin, game.ageMax)}</span>
          <span>⏱ {formatRange(game.durationMin, game.durationMax, " min")}</span>
        </div>
      </div>

      {/* Info extra */}
      <p className="text-sm mb-2">Editorial: {game.publisher}</p>
      <p className="mb-6 whitespace-pre-wrap">{game.comments}</p>

      <hr className="my-6" />

      {/* Partidas */}
      <button
        className="bg-green-600 text-white px-3 py-2 rounded mb-4"
        onClick={() => setView("create-match")}
      >
        ➕ Añadir partida
      </button>

      <h2 className="text-xl font-semibold mb-3">🏁 Partidas</h2>

      <MatchesList
        matches={matches}
        onEdit={(match) => {
          setEditingMatch(match);
          setView("edit-match");
        }}
        onDelete={(matchId) => setConfirmingMatchId(matchId)}
      />

      {/* Botones escritorio */}
      <div className="hidden md:flex gap-2 mt-6">
        <button className="border px-4 py-2 rounded" onClick={onBack}>
          ⬅ Volver
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={onEdit}
        >
          ✏️ Editar
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded"
          onClick={() => setConfirmingGame(true)}
        >
          🗑 Borrar
        </button>
      </div>

      {/* Barra fija inferior (solo móvil) */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t p-3 z-30">
        <div className="flex gap-2">
          <button
            className="flex-1 border px-3 py-2 rounded"
            onClick={onBack}
          >
            ⬅ Volver
          </button>
          <button
            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded"
            onClick={onEdit}
          >
            ✏️ Editar
          </button>
          <button
            className="flex-1 bg-red-600 text-white px-3 py-2 rounded"
            onClick={() => setConfirmingGame(true)}
          >
            🗑 Borrar
          </button>
        </div>
      </div>

      {/* Modal eliminar partida */}
      {confirmingMatchId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <h2 className="font-semibold mb-4">¿Eliminar partida?</h2>
            <div className="flex justify-end gap-2">
              <button
                className="border px-3 py-2 rounded"
                onClick={() => setConfirmingMatchId(null)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-600 text-white px-3 py-2 rounded"
                onClick={async () => {
                  await deleteMatch(confirmingMatchId);
                  setConfirmingMatchId(null);
                  loadMatches();
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal eliminar juego */}
      {confirmingGame && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <h2 className="font-semibold mb-4">¿Eliminar juego?</h2>
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

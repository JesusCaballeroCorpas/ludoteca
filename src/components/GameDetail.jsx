import { useState } from "react";

/* =====================
   GameDetail
===================== */
export default function GameDetail({ game, onBack, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{game.name}</h1>
      <div className="flex gap-4 mb-6">
        {game.image && (
          <img src={game.image} alt={game.name} className="w-1/2 h-64 object-contain bg-gray-100 rounded" />
        )}
        <div className="w-1/2 flex flex-col gap-2">
          <span>👥 {game.minPlayers}-{game.maxPlayers}</span>
          <span>🎂 {game.ageMin}+</span>
          <span>⏱ {game.durationMin} min</span>
        </div>
      </div>
      <p className="text-sm mb-2">Editorial: {game.publisher}</p>
      <p className="mb-6 whitespace-pre-wrap">{game.comments}</p>

      <div className="flex gap-2">
        <button className="border px-4 py-2 rounded" onClick={onBack}>Volver</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={onEdit}>Editar</button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded"
          onClick={() => setConfirming(true)}
        >
          Eliminar
        </button>
      </div>

      {confirming && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <h2 className="font-semibold mb-4">¿Eliminar juego?</h2>
            <p className="text-sm mb-4">Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-2">
              <button
                className="border px-3 py-2 rounded"
                onClick={() => setConfirming(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-600 text-white px-3 py-2 rounded"
                onClick={() => onDelete(game.id)}
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
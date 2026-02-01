import { useState } from "react";

export default function MatchForm({
  initialMatch,
  gameId,
  userId,
  onSave,
  onCancel,
}) {
  const [date, setDate] = useState(
    initialMatch?.date
      ? initialMatch.date.toISOString().slice(0, 10)
      : ""
  );
  const [playersCount, setPlayersCount] = useState(
    initialMatch?.playersCount ?? ""
  );
  const [notes, setNotes] = useState(initialMatch?.notes ?? "");

  function handleSubmit(e) {
    e.preventDefault();

    onSave({
      id: initialMatch?.id,
      gameId,
      userId,
      date,
      playersCount: Number(playersCount),
      notes,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 max-w-xl mx-auto flex flex-col gap-4"
    >
      <h2 className="text-xl font-bold">
        {initialMatch ? "✏️ Editar partida" : "➕ Nueva partida"}
      </h2>

      <div>
        <label className="text-sm font-medium">Fecha</label>
        <input
          type="date"
          className="border p-2 rounded w-full mt-1"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Número de jugadores</label>
        <input
          type="number"
          className="border p-2 rounded w-full mt-1"
          value={playersCount}
          onChange={(e) => setPlayersCount(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Notas</label>
        <textarea
          className="border p-2 rounded w-full mt-1"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Guardar
        </button>
        <button
          type="button"
          className="border px-4 py-2 rounded"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

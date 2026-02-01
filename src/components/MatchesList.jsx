export default function MatchesList({ matches, onEdit, onDelete }) {
  if (!matches.length) {
    return <p className="text-sm text-gray-500">Todavía no hay partidas registradas.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {matches.map((m) => (
        <div key={m.id} className="border rounded p-3 text-sm bg-gray-50">
          <div className="flex justify-between items-center">
            <span>📅 {m.date instanceof Date
              ? m.date.toLocaleDateString()
              : "Sin fecha"}
            </span>
            <div className="flex gap-2">
              <button
                className="bg-yellow-400 text-white px-2 py-1 rounded text-xs"
                onClick={() => onEdit(m)}
              >
                ✏️
              </button>
              <button
                className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                onClick={() => onDelete(m.id)}
              >
                🗑
              </button>
            </div>
          </div>

          {m.playersCount && <p>👥 Jugadores: {m.playersCount}</p>}

          {m.notes && (
            <p className="mt-1 text-gray-600">📝 {m.notes}</p>
          )}
        </div>
      ))}
    </div>
  );
}

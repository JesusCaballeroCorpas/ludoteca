export default function MatchesList({ matches }) {
  if (!matches.length) {
    return (
      <p className="text-sm text-gray-500">
        Todavía no hay partidas registradas.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {matches.map((m) => (
        <div
          key={m.id}
          className="border rounded p-3 text-sm bg-gray-50"
        >
          <div className="flex justify-between">
            <span>📅 {m.date ? m.date.toLocaleDateString() : "Sin fecha"}</span>
            {m.duration && <span>⏱ {m.duration} min</span>}
          </div>

          <div className="mt-2">
            <strong>Jugadores:</strong>
            <ul className="list-disc list-inside">
              {m.players?.map((p, i) => (
                <li key={i}>
                  {p.position && `#${p.position} `}{p.name}
                </li>
              ))}
            </ul>
          </div>

          {m.notes && (
            <p className="mt-2 text-gray-600">
              📝 {m.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

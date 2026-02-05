export default function StatsGames({ games, onBack }) {
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <button className="border px-3 py-2 rounded" onClick={onBack}>
          ⬅️
        </button>
        <h1 className="text-2xl font-bold">📊 Estadísticas</h1>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Juegos más jugados (basado en tus partidas)
      </p>

      {/* Aquí construiremos el ranking */}
      <div className="border rounded p-4 text-center text-gray-500">
        Próximamente 📈
      </div>
    </div>
  );
}

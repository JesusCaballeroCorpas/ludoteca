import { useEffect, useState } from "react";
import { getMatchesByUser } from "../services/matchesService";

export default function StatsGames({ user, games, onBack }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [totalMatches, setTotalMatches] = useState(0);

  useEffect(() => {
    if (!user?.uid) return; // 🛡️ PROTECCIÓN CLAVE

    async function loadStats() {
      setLoading(true);

      const matches = await getMatchesByUser(user.uid);
      setTotalMatches(matches.length);

      const counter = {};
      matches.forEach(m => {
        counter[m.gameId] = (counter[m.gameId] || 0) + 1;
      });

      const statsData = Object.entries(counter)
        .map(([gameId, count]) => {
          const game = games.find(g => g.id === gameId);
          return {
            gameId,
            name: game?.name || "Juego eliminado",
            count,
            percentage: matches.length
              ? Math.round((count / matches.length) * 100)
              : 0,
          };
        })
        .sort((a, b) => b.count - a.count);

      setStats(statsData);
      setLoading(false);
    }

    loadStats();
  }, [user, games]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="border px-3 py-2 rounded">
          ⬅️
        </button>
        <h1 className="text-xl font-bold">📊 Estadísticas</h1>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Total de partidas: <strong>{totalMatches}</strong>
      </p>

      <div className="flex flex-col gap-3">
        {stats.map(s => (
          <div key={s.gameId} className="border rounded p-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{s.name}</span>
              <span>{s.count} ({s.percentage}%)</span>
            </div>

            <div className="h-2 bg-gray-200 rounded overflow-hidden">
              <div
                className="h-full bg-blue-600"
                style={{ width: `${s.percentage}%` }}
              />
            </div>
          </div>
        ))}

        {stats.length === 0 && (
          <p className="text-sm text-gray-500 text-center mt-6">
            Aún no hay partidas registradas
          </p>
        )}
      </div>
    </div>
  );
}

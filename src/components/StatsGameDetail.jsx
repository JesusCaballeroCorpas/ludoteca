import { useEffect, useState } from "react";
import { getMatchesByUser } from "../services/matchesService";

export default function StatsGameDetail({ user, game, onBack }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const matches = await getMatchesByUser(user.uid);
      const gameMatches = matches.filter(m => m.gameId === game.id);

      const counter = {};

      gameMatches.forEach(m => {
        m.players?.forEach(p => {
          if (!counter[p.name]) {
            counter[p.name] = {
              name: p.name,
              games: 0,
              wins: 0,
            };
          }
          counter[p.name].games += 1;
          if (p.winner) counter[p.name].wins += 1;
        });
      });

      setStats(
        Object.values(counter).sort((a, b) => b.wins - a.wins)
      );
      setLoading(false);
    }

    load();
  }, [user, game]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-8 py-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="border px-4 py-3 rounded-lg text-lg md:text-xl hover:bg-gray-100"
        >
          ⬅️
        </button>
        <h1 className="text-2xl md:text-3xl font-bold">
          🎲 {game.name}
        </h1>
      </div>

      <div className="flex flex-col gap-4">
        {stats.map(p => (
          <div
            key={p.name}
            className="border rounded-xl p-4 md:p-6 shadow-sm"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-base md:text-lg">
                {p.name}
              </span>
              <span className="text-sm md:text-base">
                {p.wins} 🏆 / {p.games}
              </span>
            </div>

            <div className="text-xs md:text-sm text-gray-600">
              {p.games
                ? `${Math.round((p.wins / p.games) * 100)}% victorias`
                : "0% victorias"}
            </div>
          </div>
        ))}

        {stats.length === 0 && (
          <p className="text-sm text-gray-500 text-center mt-10">
            No hay partidas registradas para este juego
          </p>
        )}
      </div>
    </div>
  );
}

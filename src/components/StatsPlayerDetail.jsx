import { useEffect, useState } from "react";
import { getMatchesByUser } from "../services/matchesService";

export default function StatsPlayerDetail({ user, player, games, onBack }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    if (!user?.uid || !games) return;

    async function load() {
      setLoading(true);

      const matches = await getMatchesByUser(user.uid);
      const playerMatches = matches.filter(m =>
        m.players?.some(p => p.name === player.name)
      );

      const counter = {};

      playerMatches.forEach(m => {
        const p = m.players.find(p => p.name === player.name);
        if (!counter[m.gameId]) {
          const game = games.find(g => g.id === m.gameId);
          counter[m.gameId] = {
            gameId: m.gameId,
            name: game?.name || "Juego eliminado",
            image: game?.image || "",
            games: 0,
            wins: 0,
          };
        }
        counter[m.gameId].games += 1;
        if (p?.winner) counter[m.gameId].wins += 1;
      });

      setStats(Object.values(counter).sort((a, b) => b.games - a.games));
      setLoading(false);
    }

    load();
  }, [user, player, games]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-8 py-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="border px-4 py-3 rounded-lg text-lg md:text-xl hover:bg-gray-100"
        >
          ⬅️
        </button>
        <h1 className="text-2xl md:text-3xl font-bold">
          🏆 {player.name}
        </h1>
      </div>

      <div className="flex flex-col gap-4">
        {stats.map(g => (
          <div
            key={g.gameId}
            className="border rounded-xl p-4 md:p-6 shadow-sm flex items-center gap-4"
          >
            {g.image && (
              <img
                src={g.image}
                alt={g.name}
                className="w-12 h-12 object-contain rounded"
              />
            )}
            <div className="flex-1">
              <span className="font-semibold text-base md:text-lg">{g.name}</span>
              <div className="text-xs md:text-sm text-gray-600">
                {g.games} partidas · {g.wins} victorias · {g.games ? Math.round((g.wins / g.games) * 100) : 0}% victorias
              </div>
            </div>
          </div>
        ))}

        {stats.length === 0 && (
          <p className="text-sm text-gray-500 text-center mt-10">
            No hay partidas registradas para este jugador
          </p>
        )}
      </div>
    </div>
  );
}

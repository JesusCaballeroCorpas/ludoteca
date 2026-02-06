import { useEffect, useState } from "react";
import { getMatchesByUser } from "../services/matchesService";
import StatsPlayers from "./StatsPlayers";
import StatsGameDetail from "./StatsGameDetail";

export default function StatsGames({ user, games, onBack }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [tab, setTab] = useState("games"); // games | players
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    if (!user?.uid || !games) return;

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
            image: game?.image || "",
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
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (selectedGame) {
    return (
      <StatsGameDetail
        user={user}
        game={selectedGame}
        games={games}
        onBack={() => setSelectedGame(null)}
      />
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
          📊 Estadísticas
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTab("games")}
          className={`flex-1 px-4 py-3 rounded-lg border text-sm md:text-base font-medium ${
            tab === "games" ? "bg-blue-600 text-white" : "hover:bg-gray-100"
          }`}
        >
          🎲 Juegos
        </button>
        <button
          onClick={() => setTab("players")}
          className={`flex-1 px-4 py-3 rounded-lg border text-sm md:text-base font-medium ${
            tab === "players" ? "bg-blue-600 text-white" : "hover:bg-gray-100"
          }`}
        >
          🏆 Jugadores
        </button>
      </div>

      {/* Content */}
      {tab === "games" && (
        <>
          <p className="text-sm md:text-base text-gray-600 mb-6">
            Total de partidas registradas: <strong>{totalMatches}</strong>
          </p>

          <div className="flex flex-col gap-4">
            {stats.map(s => (
              <button
                key={s.gameId}
                onClick={() =>
                  setSelectedGame(games.find(g => g.id === s.gameId))
                }
                className="border rounded-xl p-4 md:p-6 shadow-sm text-left hover:bg-gray-50 flex items-center gap-4"
              >
                {s.image && (
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-12 h-12 object-contain rounded"
                  />
                )}
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-base md:text-lg">
                      {s.name}
                    </span>
                    <span className="text-sm md:text-base">
                      {s.count} ({s.percentage}%)
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all"
                      style={{ width: `${s.percentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-gray-400 text-xl">➔</span>
              </button>
            ))}

            {stats.length === 0 && (
              <p className="text-sm text-gray-500 text-center mt-10">
                Aún no hay partidas registradas
              </p>
            )}
          </div>
        </>
      )}

      {tab === "players" && <StatsPlayers user={user} games={games} />}
    </div>
  );
}

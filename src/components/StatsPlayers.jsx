import { useEffect, useState } from "react";
import { getMatchesByUser } from "../services/matchesService";
import StatsPlayerDetail from "./StatsPlayerDetail";

export default function StatsPlayers({ user, games }) {
  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;
    if (!games) return;

    async function loadStats() {
      setLoading(true);

      const matches = await getMatchesByUser(user.uid);

      const playersMap = {};

      matches.forEach(match => {
        match.players?.forEach(p => {
          if (!playersMap[p.name]) {
            playersMap[p.name] = {
              name: p.name,
              games: 0,
              wins: 0,
            };
          }

          playersMap[p.name].games += 1;
          if (p.winner) playersMap[p.name].wins += 1;
        });
      });

      const rankingData = Object.values(playersMap)
        .map(p => ({
          ...p,
          winRate: p.games ? Math.round((p.wins / p.games) * 100) : 0,
        }))
        .sort((a, b) => {
          if (b.wins !== a.wins) return b.wins - a.wins;
          return b.games - a.games;
        });

      setRanking(rankingData);
      setLoading(false);
    }

    loadStats();
  }, [user, games]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (selectedPlayer) {
    return (
      <StatsPlayerDetail
        user={user}
        player={selectedPlayer}
        games={games}
        onBack={() => setSelectedPlayer(null)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {ranking.map((p, index) => (
        <button
          key={p.name}
          onClick={() => setSelectedPlayer(p)}
          className="border rounded p-3 flex items-center justify-between hover:bg-gray-50 text-left w-full"
        >
          <div>
            <div className="font-medium">
              {index === 0 && "🥇 "}
              {index === 1 && "🥈 "}
              {index === 2 && "🥉 "}
              {p.name}
            </div>
            <div className="text-xs text-gray-600">
              {p.games} partidas · {p.wins} victorias
            </div>
          </div>

          <div className="flex items-center gap-2 text-right">
            <div>
              <div className="text-sm font-semibold">{p.winRate}%</div>
              <div className="text-xs text-gray-500">ratio de victorias</div>
            </div>
            <span className="text-gray-400 text-xl">➔</span>
          </div>
        </button>
      ))}

      {ranking.length === 0 && (
        <p className="text-sm text-gray-500 text-center mt-6">
          No hay partidas registradas
        </p>
      )}
    </div>
  );
}

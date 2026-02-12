import { useState } from "react";
import FiltersPanel from "./FiltersPanel";

/* =====================
   GameList
===================== */
export default function GameList({
  games = [],
  viewMode,
  onToggleView,
  onOpen,
  onCreate,
  onStats,
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    ageMin: "",
    playersMin: "",
    durationMin: "",
  });
  const [sort, setSort] = useState({ field: "name", dir: "asc" });

  /* =====================
     Helpers seguros
  ===================== */

  const safeString = (v) => (v ? String(v) : "");
  const safeNumber = (v) => (typeof v === "number" ? v : 0);

  const formatPlayers = (min, max) => {
    if (!min && !max) return "-";
    if (!max || min === max) return min || max;
    return `${min}–${max}`;
  };

  const formatAge = (min, max) => {
    if (!min && !max) return "-";
    if (!max || min === max) return `${min}+`;
    return `${min}–${max}`;
  };

  const formatDuration = (min, max) => {
    if (!min && !max) return "-";
    if (!max || min === max) return `${min} min`;
    return `${min}–${max} min`;
  };

  const toggleSort = (field) => {
    setSort((prev) =>
      prev.field === field
        ? { field, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { field, dir: "asc" }
    );
  };

  /* =====================
     Filtros seguros
  ===================== */
  const filtered = games.filter((g) => {
    const name = safeString(g.name).toLowerCase();
    const ageMin = safeNumber(g.ageMin);
    const maxPlayers = safeNumber(g.maxPlayers);
    const durationMin = safeNumber(g.durationMin);

    if (
      filters.name &&
      !name.includes(filters.name.toLowerCase())
    )
      return false;

    if (filters.ageMin !== "" && ageMin < Number(filters.ageMin))
      return false;

    if (
      filters.playersMin !== "" &&
      maxPlayers < Number(filters.playersMin)
    )
      return false;

    if (
      filters.durationMin !== "" &&
      durationMin < Number(filters.durationMin)
    )
      return false;

    return true;
  });

  /* =====================
     Orden seguro
  ===================== */
  const sorted = [...filtered].sort((a, b) => {
    const d = sort.dir === "asc" ? 1 : -1;

    if (sort.field === "players")
      return (
        (safeNumber(a.maxPlayers) - safeNumber(b.maxPlayers)) * d
      );

    if (sort.field === "age")
      return (safeNumber(a.ageMin) - safeNumber(b.ageMin)) * d;

    if (sort.field === "duration")
      return (
        (safeNumber(a.durationMin) -
          safeNumber(b.durationMin)) * d
      );

    return (
      safeString(a.name).localeCompare(
        safeString(b.name)
      ) * d
    );
  });

  const clearFilters = () =>
    setFilters({
      name: "",
      ageMin: "",
      playersMin: "",
      durationMin: "",
    });

  return (
    <div className="flex">
      {filtersOpen && (
        <div className="hidden md:block w-64 border-r">
          <FiltersPanel
            filters={filters}
            setFilters={setFilters}
            onApply={() => setFiltersOpen(false)}
            onClear={clearFilters}
          />
        </div>
      )}

      <div className="flex-1 p-4 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">
            🎲 Mi Ludoteca
          </h1>

          <div className="flex gap-2">
            <button
              className="border px-3 py-2 rounded"
              onClick={() =>
                setFiltersOpen((v) => !v)
              }
            >
              🔍
            </button>

            <button
              className="border px-3 py-2 rounded"
              onClick={onStats}
              title="Estadísticas"
            >
              📊
            </button>

            <button
              className="border px-3 py-2 rounded"
              onClick={onToggleView}
            >
              {viewMode === "cards"
                ? "📋"
                : "🗂"}
            </button>

            <button
              className="bg-blue-600 text-white px-3 py-2 rounded"
              onClick={onCreate}
            >
              ➕
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-3 text-sm">
          <span>
            {sorted.length} / {games.length} juegos
          </span>

          <div className="flex gap-1">
            <button
              onClick={() => toggleSort("name")}
              className={`px-2 border rounded ${
                sort.field === "name"
                  ? "bg-blue-100 border-blue-500"
                  : ""
              }`}
            >
              A–Z
            </button>

            <button
              onClick={() => toggleSort("players")}
              className={`px-2 border rounded ${
                sort.field === "players"
                  ? "bg-blue-100 border-blue-500"
                  : ""
              }`}
            >
              👥
            </button>

            <button
              onClick={() => toggleSort("age")}
              className={`px-2 border rounded ${
                sort.field === "age"
                  ? "bg-blue-100 border-blue-500"
                  : ""
              }`}
            >
              🎂
            </button>

            <button
              onClick={() =>
                toggleSort("duration")
              }
              className={`px-2 border rounded ${
                sort.field === "duration"
                  ? "bg-blue-100 border-blue-500"
                  : ""
              }`}
            >
              ⏱
            </button>
          </div>
        </div>

        {viewMode === "cards" ? (
          <div className="grid gap-4 md:grid-cols-3">
            {sorted.map((g) => (
              <div
                key={g.id}
                className="border rounded p-3 shadow cursor-pointer"
                onClick={() => onOpen(g)}
              >
                <h2 className="font-semibold mb-2">
                  {safeString(g.name) || "Sin nombre"}
                </h2>

                <div className="flex gap-3">
                  {g.image && (
                    <img
                      src={g.image}
                      alt={g.name}
                      className="w-1/2 h-40 object-contain bg-gray-100 rounded"
                    />
                  )}

                  <div className="w-1/2 text-sm flex flex-col gap-1">
                    <span>
                      👥{" "}
                      {formatPlayers(
                        g.minPlayers,
                        g.maxPlayers
                      )}
                    </span>
                    <span>
                      🎂{" "}
                      {formatAge(
                        g.ageMin,
                        g.ageMax
                      )}
                    </span>
                    <span>
                      ⏱{" "}
                      {formatDuration(
                        g.durationMin,
                        g.durationMax
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-md">
              <thead>
                <tr className="text-left">
                  <th>Juego</th>
                  <th className="text-center">
                    👥
                  </th>
                  <th className="text-center">
                    🎂
                  </th>
                  <th className="text-center">
                    ⏱
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((g) => (
                  <tr
                    key={g.id}
                    className="border-b cursor-pointer"
                    onClick={() =>
                      onOpen(g)
                    }
                  >
                    <td>
                      {safeString(g.name) ||
                        "Sin nombre"}
                    </td>
                    <td className="text-center">
                      {formatPlayers(
                        g.minPlayers,
                        g.maxPlayers
                      )}
                    </td>
                    <td className="text-center">
                      {formatAge(
                        g.ageMin,
                        g.ageMax
                      )}
                    </td>
                    <td className="text-center">
                      {formatDuration(
                        g.durationMin,
                        g.durationMax
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filtersOpen && (
        <div className="md:hidden fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white w-11/12 rounded">
            <FiltersPanel
              filters={filters}
              setFilters={setFilters}
              onApply={() =>
                setFiltersOpen(false)
              }
              onClear={clearFilters}
            />
          </div>
        </div>
      )}
    </div>
  );
}

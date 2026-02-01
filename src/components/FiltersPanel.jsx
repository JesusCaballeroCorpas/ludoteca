export default function FiltersPanel({ filters, setFilters, onApply, onClear }) {
  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="font-semibold">Filtros</h2>
      <div>
        <label className="text-sm font-medium">Nombre del juego</label>
        <input
          className="border p-2 rounded w-full mt-1"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Edad mínima</label>
        <input
          type="number"
          className="border p-2 rounded w-full mt-1"
          value={filters.ageMin}
          onChange={(e) => setFilters({ ...filters, ageMin: Number(e.target.value) })}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Jugadores mínimos</label>
        <input
          type="number"
          className="border p-2 rounded w-full mt-1"
          value={filters.playersMin}
          onChange={(e) => setFilters({ ...filters, playersMin: Number(e.target.value) })}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Duración mínima (min)</label>
        <input
          type="number"
          className="border p-2 rounded w-full mt-1"
          value={filters.durationMin}
          onChange={(e) => setFilters({ ...filters, durationMin: Number(e.target.value) })}
        />
      </div>
      <div className="flex gap-2 mt-2">
        <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={onApply}>
          Aplicar
        </button>
        <button className="border px-3 py-2 rounded" onClick={onClear}>
          Limpiar
        </button>
      </div>
    </div>
  );
}

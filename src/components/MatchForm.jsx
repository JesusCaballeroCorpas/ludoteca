import { useEffect, useState } from "react";
import { getUserPlayers, addPlayer } from "../services/playersService";

export default function MatchForm({
  gameId,
  userId,
  onSave,
  onCancel,
  initialData,
}) {
  /* ---------- Estado base ---------- */
  const [date, setDate] = useState(
    initialData?.date
      ? new Date(initialData.date).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState(initialData?.notes || "");

  /* ---------- Jugadores ---------- */
  const [allPlayers, setAllPlayers] = useState([]);
  const [players, setPlayers] = useState(initialData?.players || []);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [newPlayerName, setNewPlayerName] = useState("");
  const [addingNewPlayer, setAddingNewPlayer] = useState(false);

  /* ---------- Cargar jugadores ---------- */
  useEffect(() => {
    async function loadPlayers() {
      const data = await getUserPlayers(userId);
      setAllPlayers(data);
    }
    loadPlayers();
  }, [userId]);

  /* ---------- Añadir jugador existente ---------- */
  function addExistingPlayer() {
    if (!selectedPlayerId) return;
    if (players.some(p => p.playerId === selectedPlayerId)) return;

    const player = allPlayers.find(p => p.id === selectedPlayerId);
    if (!player) return;

    setPlayers([
      ...players,
      {
        playerId: player.id,
        name: player.name,
        score: "",
        winner: false,
      },
    ]);
    setSelectedPlayerId("");
  }

  /* ---------- Crear y añadir jugador nuevo ---------- */
  async function createAndAddPlayer() {
    if (!newPlayerName.trim()) return;

    const exists = allPlayers.some(
      p => p.name.toLowerCase() === newPlayerName.toLowerCase()
    );
    if (exists) {
      alert("Ese jugador ya existe");
      return;
    }

    const newPlayer = await addPlayer(newPlayerName.trim(), userId);

    setAllPlayers([...allPlayers, newPlayer]);
    setPlayers([
      ...players,
      {
        playerId: newPlayer.id,
        name: newPlayer.name,
        score: "",
        winner: false,
      },
    ]);

    setNewPlayerName("");
    setAddingNewPlayer(false);
  }

  /* ---------- Actualizar jugador ---------- */
  function updatePlayer(index, field, value) {
    const copy = [...players];
    copy[index][field] = value;
    setPlayers(copy);
  }

  /* ---------- Eliminar jugador ---------- */
  function removePlayer(index) {
    setPlayers(players.filter((_, i) => i !== index));
  }

  /* ---------- Guardar ---------- */
  function handleSubmit(e) {
    e.preventDefault();

    onSave({
      gameId,
      userId,
      date,
      notes,
      players: players.map(p => ({
        ...p,
        score: p.score === "" ? undefined : Number(p.score),
      })),
      createdAt: initialData?.createdAt || Date.now(),
    });
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="p-4 w-full max-w-xl mx-auto flex flex-col gap-4 pb-24 md:pb-4"
      >
        <h2 className="text-xl font-bold">
          {initialData ? "✏️ Editar partida" : "➕ Nueva partida"}
        </h2>

        {/* Fecha */}
        <div>
          <label className="text-sm font-medium">📅 Fecha</label>
          <input
            type="date"
            className="border p-2 rounded w-full mt-1"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        {/* Añadir jugador */}
        <div>
          <label className="text-sm font-medium">👤 Añadir jugador</label>
          <div className="flex flex-col sm:flex-row gap-2 mt-1">
            <select
              className="border p-2 rounded flex-1"
              value={selectedPlayerId}
              onChange={e => setSelectedPlayerId(e.target.value)}
            >
              <option value="">Selecciona jugador</option>
              {allPlayers.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <button
              type="button"
              className="bg-blue-600 text-white px-3 py-2 rounded"
              onClick={addExistingPlayer}
            >
              ➕ Añadir
            </button>
          </div>

          <button
            type="button"
            className="text-sm text-blue-600 mt-1"
            onClick={() => setAddingNewPlayer(true)}
          >
            👤 Crear nuevo jugador
          </button>
        </div>

        {/* Crear nuevo jugador */}
        {addingNewPlayer && (
          <div className="border p-3 rounded bg-gray-50">
            <input
              className="border p-2 rounded w-full"
              placeholder="Nombre del jugador"
              value={newPlayerName}
              onChange={e => setNewPlayerName(e.target.value)}
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={createAndAddPlayer}
              >
                💾 Guardar
              </button>
              <button
                type="button"
                className="border px-3 py-1 rounded"
                onClick={() => setAddingNewPlayer(false)}
              >
                ✖ Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Jugadores añadidos */}
        {players.map((p, i) => (
          <div key={i} className="border p-3 rounded bg-white">
            <div className="flex justify-between items-center mb-2">
              <strong>{p.name}</strong>
              <button type="button" onClick={() => removePlayer(i)}>
                ❌
              </button>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={p.winner}
                  onChange={e => updatePlayer(i, "winner", e.target.checked)}
                />
                🏆 Ganador
              </label>

              <input
                type="number"
                placeholder="Puntos"
                className="border p-2 rounded w-24"
                value={p.score}
                onChange={e => updatePlayer(i, "score", e.target.value)}
              />
            </div>
          </div>
        ))}

        {/* Notas */}
        <div>
          <label className="text-sm font-medium">📝 Notas</label>
          <textarea
            className="border p-2 rounded w-full mt-1"
            rows={3}
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        {/* Botones PC */}
        <div className="hidden md:flex gap-2 mt-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            💾 Guardar
          </button>
          <button
            type="button"
            className="border px-4 py-2 rounded"
            onClick={onCancel}
          >
            ✖ Cancelar
          </button>
        </div>
      </form>

      {/* Barra fija móvil (estilo GameDetail) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex justify-center gap-2 p-3">
          <button
            type="button"
            className="border px-4 py-2 rounded"
            onClick={onCancel}
          >
            ✖ Cancelar
          </button>
          <button
            type="button"
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            💾 Guardar
          </button>
        </div>
      </div>
    </>
  );
}

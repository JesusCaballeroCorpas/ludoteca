import { useState } from "react";

/* =====================
   GameForm
===================== */
export default function GameForm({ initialGame, onSave, onCancel }) {
  const [game, setGame] = useState(
    initialGame || {
      name: "",
      minPlayers: "",
      maxPlayers: "",
      ageMin: "",
      ageMax: "",
      durationMin: "",
      durationMax: "",
      publisher: "",
      image: "",
      comments: "",
    }
  );

  const update = (field, value) => {
    setGame((g) => ({ ...g, [field]: value }));
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {initialGame ? "Editar juego" : "Añadir juego"}
      </h1>

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium">Nombre del juego</label>
          <input
            className="border p-2 rounded w-full mt-1"
            value={game.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Número de jugadores</label>
          <div className="flex gap-2 mt-1">
            <input
              type="number"
              className="border p-2 rounded w-1/2"
              value={game.minPlayers}
              onChange={(e) => update("minPlayers", e.target.value ? Number(e.target.value) : "")}
            />
            <input
              type="number"
              className="border p-2 rounded w-1/2"
              value={game.maxPlayers}
              onChange={(e) => update("maxPlayers", e.target.value ? Number(e.target.value) : "")}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Duración (minutos)</label>
          <div className="flex gap-2 mt-1">
            <input
              type="number"
              className="border p-2 rounded w-1/2"
              value={game.durationMin}
              onChange={(e) => update("durationMin", e.target.value ? Number(e.target.value) : "")}
            />
            <input
              type="number"
              className="border p-2 rounded w-1/2"
              value={game.durationMax}
              onChange={(e) => update("durationMax", e.target.value ? Number(e.target.value) : "")}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Edad recomendada</label>
          <div className="flex gap-2 mt-1">
            <input
              type="number"
              className="border p-2 rounded w-1/2"
              value={game.ageMin}
              onChange={(e) => update("ageMin", e.target.value ? Number(e.target.value) : "")}
            />
            <input
              type="number"
              className="border p-2 rounded w-1/2"
              value={game.ageMax}
              onChange={(e) => update("ageMax", e.target.value ? Number(e.target.value) : "")}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Editorial</label>
          <input
            className="border p-2 rounded w-full mt-1"
            value={game.publisher}
            onChange={(e) => update("publisher", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Imagen</label>
          <input
            type="file"
            accept="image/*"
            className="border p-2 rounded w-full mt-1"
            onChange={(e) => {
              const file = e.target.files && e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => update("image", String(reader.result));
              reader.readAsDataURL(file);
            }}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Comentarios</label>
          <textarea
            className="border p-2 rounded w-full mt-1"
            rows={4}
            value={game.comments}
            onChange={(e) => update("comments", e.target.value)}
          />
        </div>

        <div className="flex gap-2 mt-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => onSave(game)}
          >
            Guardar
          </button>
          <button className="border px-4 py-2 rounded" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import {
  getAllGlobalGames,
  createGlobalGame,
} from "../services/globalGamesService";

/* =====================
   Util: compresión imagen
===================== */
function compressImage(file, maxSize = 300, quality = 0.5) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    const img = new Image();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(
        maxSize / img.width,
        maxSize / img.height,
        1
      );

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const compressedBase64 = canvas.toDataURL(
        "image/jpeg",
        quality
      );

      resolve(compressedBase64);
    };

    reader.readAsDataURL(file);
  });
}

/* =====================
   GameForm
===================== */
export default function GameForm({
  initialGame,
  onSave,
  onCancel,
  isAdminGlobalEdit = false,
}) {
  const isEditMode = !!initialGame;

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
      gameId: null,
    }
  );

  const [compressing, setCompressing] = useState(false);

  /* =====================
     GLOBAL GAMES
  ===================== */

  const [allGlobalGames, setAllGlobalGames] = useState([]);
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadGlobalGames();
  }, []);

  async function loadGlobalGames() {
    const data = await getAllGlobalGames();
    setAllGlobalGames(data);
  }

  const update = (field, value) => {
    setGame((g) => ({ ...g, [field]: value }));
  };

  const filteredResults =
    search.trim() === ""
      ? []
      : allGlobalGames.filter((g) =>
          g.name.toLowerCase().includes(search.toLowerCase())
        );

  const selectGlobalGame = (g) => {
    setGame({
      ...g,
      gameId: g.id,
    });
    setSearch(g.name);
    setShowResults(false);
  };

  /* 🔥 NUEVO: Saber si está vinculado */
  const isLinkedToGlobal =
    !isAdminGlobalEdit && !isEditMode && !!game.gameId;

  /* =====================
     RESTAURAR DESDE GLOBAL
  ===================== */

  const handleRestoreGlobal = () => {
    if (!game.gameId) return;

    const global = allGlobalGames.find(
      (g) => g.id === game.gameId
    );

    if (!global) return;

    setGame((prev) => ({
      ...prev,
      name: global.name || "",
      minPlayers: global.minPlayers || 0,
      maxPlayers: global.maxPlayers || 0,
      ageMin: global.ageMin || 0,
      ageMax: global.ageMax || 0,
      durationMin: global.durationMin || 0,
      durationMax: global.durationMax || 0,
      image: global.image || "",
      comments: prev.comments,
      publisher: prev.publisher,
      gameId: prev.gameId,
    }));
  };

  /* =====================
     GUARDAR
  ===================== */

  const handleSave = async () => {
    if (!game.name.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    let finalGame = { ...game };

    if (!isEditMode && !isAdminGlobalEdit) {
      if (!game.gameId) {
        const existing = allGlobalGames.find(
          (g) =>
            g.name.toLowerCase().trim() ===
            game.name.toLowerCase().trim()
        );

        if (existing) {
          finalGame.gameId = existing.id;
        } else {
          const created = await createGlobalGame(game);
          finalGame.gameId = created.id;
        }
      }
    }

    onSave(finalGame);
  };

  /* =====================
     RENDER
  ===================== */

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {isEditMode ? "Editar juego" : "Añadir juego"}
      </h1>

      <div className="flex flex-col gap-4">

        {/* BUSCADOR SOLO EN ALTA */}
        {!isEditMode && !isAdminGlobalEdit && (
          <div className="relative">
            <label className="text-sm font-medium">
              Buscar juego existente
            </label>
            <input
              className="border p-2 rounded w-full mt-1"
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);
                setShowResults(true);

                // 🔥 Si modifica manualmente el texto, se desvincula
                if (value !== game.name) {
                  setGame((prev) => ({
                    ...prev,
                    gameId: null,
                  }));
                }
              }}
              placeholder="Escribe para buscar..."
            />

            {showResults && filteredResults.length > 0 && (
              <div className="absolute z-10 bg-white border w-full max-h-48 overflow-y-auto rounded shadow">
                {filteredResults.map((g) => (
                  <div
                    key={g.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectGlobalGame(g)}
                  >
                    {g.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BOTÓN RESTAURAR */}
        {isEditMode && game.gameId && !isAdminGlobalEdit && (
          <button
            type="button"
            onClick={handleRestoreGlobal}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Actualizar con datos globales
          </button>
        )}

        {/* Nombre */}
        <div>
          <label className="text-sm font-medium">
            Nombre del juego
          </label>
          <input
            className={`border p-2 rounded w-full mt-1 ${
              isLinkedToGlobal
                ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                : ""
            }`}
            value={game.name}
            readOnly={isLinkedToGlobal}
            onChange={(e) =>
              update("name", e.target.value)
            }
          />
        </div>

        {/* Número jugadores */}
        <div>
          <label className="text-sm font-medium">
            Número de jugadores
          </label>
          <div className="flex flex-col md:flex-row gap-2 mt-1">
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={game.minPlayers}
              onChange={(e) =>
                update(
                  "minPlayers",
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              placeholder="Mínimo"
            />
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={game.maxPlayers}
              onChange={(e) =>
                update(
                  "maxPlayers",
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              placeholder="Máximo"
            />
          </div>
        </div>

        {/* Duración */}
        <div>
          <label className="text-sm font-medium">
            Duración (minutos)
          </label>
          <div className="flex flex-col md:flex-row gap-2 mt-1">
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={game.durationMin}
              onChange={(e) =>
                update(
                  "durationMin",
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              placeholder="Mínima"
            />
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={game.durationMax}
              onChange={(e) =>
                update(
                  "durationMax",
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              placeholder="Máxima"
            />
          </div>
        </div>

        {/* Edad */}
        <div>
          <label className="text-sm font-medium">
            Edad recomendada
          </label>
          <div className="flex flex-col md:flex-row gap-2 mt-1">
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={game.ageMin}
              onChange={(e) =>
                update(
                  "ageMin",
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              placeholder="Mínima"
            />
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={game.ageMax}
              onChange={(e) =>
                update(
                  "ageMax",
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              placeholder="Máxima"
            />
          </div>
        </div>

        {/* Editorial */}
        <div>
          <label className="text-sm font-medium">
            Editorial
          </label>
          <input
            className="border p-2 rounded w-full mt-1"
            value={game.publisher}
            onChange={(e) =>
              update("publisher", e.target.value)
            }
          />
        </div>

        {/* Imagen */}
        <div>
          <label className="text-sm font-medium">
            Imagen
          </label>
          <input
            type="file"
            accept="image/*"
            className="border p-2 rounded w-full mt-1"
            disabled={compressing}
            onChange={async (e) => {
              const file =
                e.target.files && e.target.files[0];
              if (!file) return;

              setCompressing(true);
              const compressed =
                await compressImage(file);
              update("image", compressed);
              setCompressing(false);
            }}
          />
        </div>

        {/* Comentarios */}
        <div>
          <label className="text-sm font-medium">
            Comentarios
          </label>
          <textarea
            className="border p-2 rounded w-full mt-1"
            rows={4}
            value={game.comments}
            onChange={(e) =>
              update("comments", e.target.value)
            }
          />
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto disabled:opacity-60"
            onClick={handleSave}
            disabled={compressing}
          >
            Guardar
          </button>
          <button
            className="border px-4 py-2 rounded w-full sm:w-auto"
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

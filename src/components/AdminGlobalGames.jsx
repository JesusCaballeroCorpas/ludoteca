import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

export default function AdminGlobalGames({ onBack }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGames();
  }, []);

  async function loadGames() {
    setLoading(true);

    const snap = await getDocs(collection(db, "globalGames"));
    const list = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    setGames(list);
    setLoading(false);
  }

  async function deleteGame(id) {
    if (!window.confirm("¿Seguro que quieres borrar este juego global?"))
      return;

    await deleteDoc(doc(db, "globalGames", id));
    loadGames();
  }

  if (loading) return <div className="p-4">Cargando...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">
          ⚙ Panel Admin - Global Games
        </h1>

        <button
          onClick={onBack}
          className="border px-3 py-1 rounded"
        >
          ← Volver
        </button>
      </div>

      <div className="grid gap-3">
        {games.map((g) => (
          <div
            key={g.id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">
                {g.name}
              </div>
              <div className="text-sm text-gray-500">
                {g.minPlayers}–{g.maxPlayers} jugadores
              </div>
            </div>

            <button
              onClick={() => deleteGame(g.id)}
              className="bg-red-600 text-white px-2 py-1 rounded"
            >
              Borrar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

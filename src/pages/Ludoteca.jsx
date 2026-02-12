import { useState } from "react";
import {
  doc,
  deleteDoc,
  collection,
  addDoc,
  getDocs,
  setDoc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

import useUserGames from "../hooks/useUserGames";

import GameList from "../components/GameList";
import GameForm from "../components/GameForm";
import GameDetail from "../components/GameDetail";
import StatsGames from "../components/StatsGames";

export default function Ludoteca({ user }) {
  const { userGames: games, loading } = useUserGames(user.uid);

  const [view, setView] = useState("list");
  const [viewMode, setViewMode] = useState("cards");
  const [selectedGame, setSelectedGame] = useState(null);
  const [saving, setSaving] = useState(false);

  const isAdmin = user.email === "jesuscaba84@gmail.com";

  /* =====================
     GUARDAR JUEGO
  ===================== */
  async function saveGame(game) {
    setSaving(true);

    try {
      let globalGameId = game.gameId;
      let globalData = {};

      // 🔎 Buscar si ya existe por nombre
      if (!globalGameId) {
        const q = query(
          collection(db, "globalGames"),
          where("name", "==", game.name)
        );

        const snap = await getDocs(q);

        if (!snap.empty) {
          globalGameId = snap.docs[0].id;
          globalData = snap.docs[0].data();
        } else {
          const newGlobal = await addDoc(collection(db, "globalGames"), {
            name: game.name,
            minPlayers: game.minPlayers || 0,
            maxPlayers: game.maxPlayers || 0,
            ageMin: game.ageMin || 0,
            ageMax: game.ageMax || 0,
            durationMin: game.durationMin || 0,
            durationMax: game.durationMax || 0,
            image: game.image || "",
            createdAt: Date.now(),
          });

          globalGameId = newGlobal.id;

          globalData = {
            name: game.name,
            minPlayers: game.minPlayers || 0,
            maxPlayers: game.maxPlayers || 0,
            ageMin: game.ageMin || 0,
            ageMax: game.ageMax || 0,
            durationMin: game.durationMin || 0,
            durationMax: game.durationMax || 0,
            image: game.image || "",
          };
        }
      }

      // 🔁 Si admin y edita global
      if (isAdmin && game.gameId) {
        await updateDoc(doc(db, "globalGames", game.gameId), {
          name: game.name,
          minPlayers: game.minPlayers,
          maxPlayers: game.maxPlayers,
          ageMin: game.ageMin,
          ageMax: game.ageMax,
          durationMin: game.durationMin,
          durationMax: game.durationMax,
          image: game.image,
        });

        globalData = {
          name: game.name,
          minPlayers: game.minPlayers,
          maxPlayers: game.maxPlayers,
          ageMin: game.ageMin,
          ageMax: game.ageMax,
          durationMin: game.durationMin,
          durationMax: game.durationMax,
          image: game.image,
        };
      }

      // 🔥 Guardamos TODO en userGames (DESNORMALIZADO)
      await setDoc(
        doc(db, "userGames", game.id || globalGameId),
        {
          userId: user.uid,
          gameId: globalGameId,
          ...globalData,
          comments: game.comments || "",
          publisher: game.publisher || "",
          createdAt: Date.now(),
        },
        { merge: true }
      );

      setView("list");
    } finally {
      setSaving(false);
    }
  }


  /* =====================
     ELIMINAR DE TU LUDOTECA
  ===================== */
  async function removeGame(userGameDocId) {
    setSaving(true);
    try {
      await deleteDoc(doc(db, "userGames", userGameDocId));
      setView("list");
    } catch (error) {
      console.error("Error eliminando juego:", error);
    } finally {
      setSaving(false);
    }
  }

  if (loading || saving) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <span className="text-sm text-gray-600">🎲 Cargando juegos…</span>
      </div>
    );
  }

  if (view === "stats")
    return (
      <StatsGames
        user={user}
        games={games}
        onBack={() => setView("list")}
      />
    );

  if (view === "create")
    return (
      <GameForm
        onSave={saveGame}
        onCancel={() => setView("list")}
      />
    );

  if (view === "edit" && selectedGame)
    return (
      <GameForm
        initialGame={selectedGame}
        onSave={saveGame}
        onCancel={() => setView("detail")}
      />
    );

  if (view === "detail" && selectedGame)
    return (
      <GameDetail
        game={selectedGame}
        user={user}
        onBack={() => setView("list")}
        onEdit={() => setView("edit")}
        onDelete={(id) => removeGame(id)}
      />
    );

  return (
    <GameList
      games={games}
      viewMode={viewMode}
      onToggleView={() =>
        setViewMode((v) => (v === "cards" ? "list" : "cards"))
      }
      onCreate={() => setView("create")}
      onStats={() => setView("stats")}
      onOpen={(g) => {
        setSelectedGame(g);
        setView("detail");
      }}
    />
  );
}

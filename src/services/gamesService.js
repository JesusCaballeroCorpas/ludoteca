import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";

/* =========================
   GLOBAL COLLECTIONS
========================= */

const globalGamesCollection = collection(db, "globalGames");
const userGamesCollection = collection(db, "userGames");

/* =========================
   GET USER GAMES
   (ya no se usa directamente,
   lo hace el hook)
========================= */
export async function getUserGames(userId) {
  const q = query(
    collection(db, "userGames"),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/* =========================
   ADD GAME (NUEVO MODELO)
========================= */
export async function addGame(game, userId) {
  // 1️⃣ Buscar si el juego ya existe en globalGames por nombre
  const q = query(
    globalGamesCollection,
    where("name", "==", game.name)
  );

  const existing = await getDocs(q);

  let globalGameId;

  if (!existing.empty) {
    // Ya existe
    globalGameId = existing.docs[0].id;
  } else {
    // No existe → lo creamos global
    const globalRef = await addDoc(globalGamesCollection, {
      name: game.name,
      minPlayers: game.minPlayers || "",
      maxPlayers: game.maxPlayers || "",
      ageMin: game.ageMin || "",
      ageMax: game.ageMax || "",
      durationMin: game.durationMin || "",
      durationMax: game.durationMax || "",
      image: game.image || "",
      createdAt: Date.now(),
    });

    globalGameId = globalRef.id;
  }

  // 2️⃣ Crear entrada en userGames
  await addDoc(userGamesCollection, {
    userId,
    gameId: globalGameId,
    comments: game.comments || "",
    publisher: game.publisher || "",
    createdAt: Date.now(),
  });
}

/* =========================
   UPDATE GAME
========================= */
export async function updateGame(userGameId, game) {
  const userGameRef = doc(db, "userGames", userGameId);
  const userGameSnap = await getDoc(userGameRef);

  if (!userGameSnap.exists()) return;

  const { gameId } = userGameSnap.data();

  // 🔹 Actualizamos SOLO datos del usuario
  await updateDoc(userGameRef, {
    comments: game.comments || "",
    publisher: game.publisher || "",
  });

  // 🔹 Opcional: actualizar datos globales
  // (de momento lo dejamos activo para ti como "admin único")

  const globalRef = doc(db, "globalGames", gameId);
  await updateDoc(globalRef, {
    name: game.name,
    minPlayers: game.minPlayers || "",
    maxPlayers: game.maxPlayers || "",
    ageMin: game.ageMin || "",
    ageMax: game.ageMax || "",
    durationMin: game.durationMin || "",
    durationMax: game.durationMax || "",
    image: game.image || "",
  });
}

/* =========================
   DELETE GAME
   (solo de la ludoteca)
========================= */
export async function deleteGame(userGameId) {
  const ref = doc(db, "userGames", userGameId);
  await deleteDoc(ref);
}

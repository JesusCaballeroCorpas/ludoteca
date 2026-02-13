import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";

/* =========================
   Obtener todos los globalGames
========================= */
export async function getAllGlobalGames() {
  const snap = await getDocs(collection(db, "globalGames"));
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/* =========================
   Crear globalGame evitando duplicados
========================= */
export async function createGlobalGame(game) {
  const snap = await getDocs(collection(db, "globalGames"));

  const exists = snap.docs.some(
    (doc) =>
      doc.data().name?.toLowerCase().trim() ===
      game.name?.toLowerCase().trim()
  );

  if (exists) {
    throw new Error("Ya existe un juego con ese nombre");
  }

  const ref = await addDoc(collection(db, "globalGames"), game);

  return {
    id: ref.id,
    ...game,
  };
}

export async function getGlobalGameById(id) {
  const snap = await getDoc(doc(db, "globalGames", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}


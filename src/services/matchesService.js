import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const matchesCollection = collection(db, "matches");

// Obtener partidas de un juego de un usuario
export async function getMatchesByGame(gameId, userId) {
  const q = query(
    matchesCollection,
    where("gameId", "==", gameId),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Convertimos Timestamp a Date para mostrar correctamente
      date: data.date ? data.date.toDate() : null,
    };
  });
}

// Añadir una partida
export async function addMatch(match, gameId, userId) {
  await addDoc(matchesCollection, {
    ...match,
    gameId,
    userId,
    // Guardamos la fecha como Timestamp
    date: match.date ? Timestamp.fromDate(new Date(match.date)) : Timestamp.now(),
    createdAt: Timestamp.now(),
  });
}

// Actualizar una partida (opcional, si luego añades edición)
export async function updateMatch(matchId, match) {
  const ref = doc(db, "matches", matchId);
  await updateDoc(ref, {
    ...match,
    date: match.date ? Timestamp.fromDate(new Date(match.date)) : Timestamp.now(),
  });
}

// Eliminar una partida
export async function deleteMatch(matchId) {
  const ref = doc(db, "matches", matchId);
  await deleteDoc(ref);
}

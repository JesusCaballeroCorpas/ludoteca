import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const matchesCollection = collection(db, "matches");

export async function getMatchesByGame(gameId, userId) {
  const q = query(
    matchesCollection,
    where("gameId", "==", gameId),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(d => {
    const data = d.data();

    return {
      id: d.id,
      ...data,
      date: data.date?.toDate
        ? data.date.toDate()     // Timestamp → Date
        : data.date
        ? new Date(data.date)    // string → Date
        : null,
    };
  });
}

/* =========================
   CREAR PARTIDA
========================= */
export async function addMatch(match, gameId, userId) {
  const { id, ...matchData } = match; // ⬅️ CLAVE

  await addDoc(matchesCollection, {
    ...matchData,
    gameId,
    userId,
    createdAt: Timestamp.now(),
  });
}

/* =========================
   EDITAR PARTIDA
========================= */
export async function updateMatch(matchId, match) {
  const { id, ...matchData } = match;

  const ref = doc(db, "matches", matchId);
  await updateDoc(ref, {
    ...matchData,
  });
}

/* =========================
   ELIMINAR PARTIDA
========================= */
export async function deleteMatch(matchId) {
  const ref = doc(db, "matches", matchId);
  await deleteDoc(ref);
}

export async function getMatchesByUser(userId) {
  const q = query(
    matchesCollection,
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      date: data.date?.toDate
        ? data.date.toDate()
        : data.date
        ? new Date(data.date)
        : null,
    };
  });
}

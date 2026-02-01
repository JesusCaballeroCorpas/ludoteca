import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

const gamesCollection = collection(db, "games");

export async function getUserGames(userId) {
  const q = query(gamesCollection, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addGame(game, userId) {
  await addDoc(gamesCollection, {
    ...game,
    userId,
    createdAt: Date.now(),
  });
}

export async function updateGame(gameId, game) {
  const ref = doc(db, "games", gameId);
  await updateDoc(ref, game);
}

export async function deleteGame(gameId) {
  const ref = doc(db, "games", gameId);
  await deleteDoc(ref);
}

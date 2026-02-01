import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

const playersCollection = collection(db, "players");

export async function getUserPlayers(userId) {
  const q = query(playersCollection, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function addPlayer(name, userId) {
  const ref = await addDoc(playersCollection, {
    name,
    userId,
    createdAt: Date.now(),
  });

  return {
    id: ref.id,
    name,
    userId,
  };
}

import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";

export default function useGlobalGames() {
  const [globalGames, setGlobalGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "globalGames"),
      (snapshot) => {
        const games = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setGlobalGames(games);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { globalGames, loading };
}

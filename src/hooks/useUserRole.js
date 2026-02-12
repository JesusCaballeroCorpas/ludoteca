import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function useUserRole(user) {
  const [role, setRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function loadRole() {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));

        if (snap.exists()) {
          setRole(snap.data().role || "user");
        } else {
          setRole("user");
        }
      } catch (error) {
        console.error("Error cargando role:", error);
        setRole("user");
      }

      setLoadingRole(false);
    }

    loadRole();
  }, [user]);

  return { role, loadingRole };
}

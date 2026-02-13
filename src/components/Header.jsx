import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import AboutModal from "./AboutModal";
import { useState } from "react";

export default function Header({ user }) {
  
  const [aboutOpen, setAboutOpen] = useState(false);
  
  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <header className="flex items-center justify-between bg-slate-800 text-white px-4 py-2">
      <span className="text-sm">
        Usuario: <strong>{user.email}</strong>
      </span>
      <div>
        <button
          className="px-3 py-2 rounded"
          onClick={() => setAboutOpen(true)}
          title="Acerca de"
        >
          ℹ️
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
        >
          Cerrar sesión
        </button>
      </div>
      
      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}
    </header>
    
    
  );
}

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
    <header className="flex items-center justify-between bg-slate-800 text-white px-3 py-2 gap-2">
      
      {/* Email (se adapta en móvil) */}
      <span className="text-xs sm:text-sm truncate">
        Usuario: <strong>{user.email}</strong>
      </span>

      {/* Botones */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => setAboutOpen(true)}
          title="Acerca de"
          className="flex items-center justify-center w-8 h-8 rounded hover:bg-slate-700 text-sm"
        >
          ℹ️
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm whitespace-nowrap"
        >
          Cerrar sesión
        </button>
      </div>

      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}
    </header>
  );
}

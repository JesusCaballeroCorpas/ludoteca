import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Header({ user }) {
  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <header className="flex items-center justify-between bg-slate-800 text-white px-4 py-2">
      <span className="text-sm">
        Usuario: <strong>{user.email}</strong>
      </span>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
      >
        Cerrar sesión
      </button>
    </header>
  );
}

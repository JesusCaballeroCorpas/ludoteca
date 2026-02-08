import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";

const googleProvider = new GoogleAuthProvider();

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (e) {
      setError("Email o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError("");
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (e) {
      setError("No se pudo crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onLogin();
    } catch (e) {
      setError("Error al iniciar sesión con Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-sm p-6 rounded-lg shadow">
        {/* Logo + nombre */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎲</div>
          <h1 className="text-2xl font-bold">Mi Ludoteca</h1>
          <p className="text-sm text-gray-500">
            Registra tus juegos, partidas y ve las estadísticas
          </p>
        </div>

        {error && (
          <p className="text-red-600 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded w-full mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="border p-2 rounded w-full mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex flex-col gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
            onClick={handleLogin}
            disabled={loading}
          >
            Entrar
          </button>

          <button
            className="border px-4 py-2 rounded disabled:opacity-60"
            onClick={handleRegister}
            disabled={loading}
          >
            Crear cuenta
          </button>

          <div className="flex items-center gap-2 my-2">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-xs text-gray-400">o</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="border px-4 py-2 rounded flex items-center justify-center gap-3 hover:bg-gray-50 disabled:opacity-60"
          >
            {/* Google G */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.07 1.53 7.46 2.8l5.45-5.45C33.6 3.9 29.2 1.5 24 1.5 14.94 1.5 7.2 6.86 3.6 14.66l6.36 4.94C11.54 13.36 17.3 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.5 24.5c0-1.64-.15-3.22-.43-4.75H24v9h12.7c-.55 2.96-2.2 5.46-4.7 7.15l7.24 5.62C43.73 37.4 46.5 31.5 46.5 24.5z"
              />
              <path
                fill="#FBBC05"
                d="M9.96 28.6c-.48-1.44-.76-2.97-.76-4.6s.28-3.16.76-4.6L3.6 14.66C2.04 17.86 1.5 21.36 1.5 25s.54 7.14 2.1 10.34l6.36-4.74z"
              />
              <path
                fill="#34A853"
                d="M24 46.5c6.2 0 11.4-2.04 15.2-5.58l-7.24-5.62c-2.02 1.36-4.6 2.16-7.96 2.16-6.7 0-12.46-3.86-14.04-9.1l-6.36 4.74C7.2 41.14 14.94 46.5 24 46.5z"
              />
            </svg>
            Continuar con Google
          </button>
        </div>
      </div>
    </div>
  );
}

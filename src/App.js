import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Header from "./components/Header";


import Login from "./pages/Login";
import Ludoteca from "./pages/Ludoteca";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  if (!user) return <Login />;

  return user ? (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      <Ludoteca user={user} />
    </div>
  ) : (
    <Login />
  );

}

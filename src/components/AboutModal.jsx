/* =====================
   AboutModal
===================== */
export default function AboutModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center text-black z-50">
      <div className="bg-white w-11/12 max-w-md rounded shadow-lg p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4">
          ℹ️ Acerca de
        </h2>

        <div className="text-sm flex flex-col gap-3">
          <p>
            <strong>Mi Ludoteca</strong>
          </p>

          <p>
            Aplicación para gestionar y consultar tu colección
            de juegos de mesa.
          </p>

          <p>
            👤 <strong>Desarrollado por:</strong><br />
            Jesús Caballero Corpas
          </p>

          <p>
            📧 <strong>Contacto:</strong><br />
            <a
              href="mailto:jesuscaba84@gmail.com"
              className="text-blue-600 underline"
            >
              jesuscaba84@gmail.com
            </a>
          </p>

          <p>
            🛠 <strong>Tecnologías:</strong><br />
            React + Firebase
          </p>

          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}

// // src/pages/Graduados/CertificadosGraduado.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const CertificadosGraduado = () => {
  const { token } = useAuth();
  const API = import.meta.env.VITE_API_URL;

  const [talleres, setTalleres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const fetchTalleres = async () => {
      try {
        const res = await fetch(`${API}/api/talleres`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Error cargando talleres");
        const data = await res.json();
        setTalleres(data.filter(t => t.enrolled)); // solo inscritos
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTalleres();
  }, [API, token]);

  const handleDownload = async (courseId, name) => {
    try {
      const res = await fetch(`${API}/api/certificados/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const contentType = res.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          const err = await res.json();
          throw new Error(err.error || "No se pudo descargar");
        } else {
          const errText = await res.text();
          throw new Error(errText || "No se pudo descargar");
        }
      }

      const blob = await res.blob();
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `Certificado-${name}.pdf`; 
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("✅ Certificado descargado correctamente");
    } catch (e) {
      toast.error("❌ " + e.message);
    }
  };

  if (loading) return <p className="p-6">Cargando certificados…</p>;
  if (error)   return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Mis Certificados
      </h1>

      {talleres.length === 0 && (
        <p className="text-center text-gray-600 dark:text-gray-400">
          Aún no tienes talleres inscritos.
        </p>
      )}

      <ul className="space-y-4">
        {talleres.map(t => (
          <li
            key={t.IdCourse}
            className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
          >
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {t.Name_course}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(t.Date_course).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleDownload(t.IdCourse, t.Name_course)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Descargar certificado
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CertificadosGraduado;



// import { useEffect, useState } from "react";
// import { useAuth } from "../../context/AuthContext";

// const CertificadosGraduado = () => {
//   const { token } = useAuth();
//   const API = import.meta.env.VITE_API_URL;

//   const [talleres, setTalleres] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError]     = useState("");

//   useEffect(() => {
//     const fetchTalleres = async () => {
//       try {
//         const res = await fetch(`${API}/api/talleres`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         if (!res.ok) throw new Error("Error cargando talleres");
//         const data = await res.json();
//         // sólo los enqueued (= inscrito)
//         setTalleres(data.filter(t => t.enrolled));
//       } catch (e) {
//         setError(e.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTalleres();
//   }, [API, token]);

//   const handleDownload = async (courseId, name) => {
//     try {
//       const res = await fetch(`${API}/api/certificados/${courseId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (!res.ok) throw new Error("No se pudo descargar");
//       const blob = await res.blob();
//       const url  = window.URL.createObjectURL(blob);
//       const a    = document.createElement("a");
//       a.href     = url;
//       a.download = `Certificado-${name}.pdf`; 
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (e) {
//       alert("❌ " + e.message);
//     }
//   };

//   if (loading) return <p className="p-6">Cargando certificados…</p>;
//   if (error)   return <p className="p-6 text-red-500">{error}</p>;

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
//       <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
//         Mis Certificados
//       </h1>
//       {talleres.length === 0 && (
//         <p className="text-center text-gray-600 dark:text-gray-400">
//           Aún no tienes talleres inscritos.
//         </p>
//       )}
//       <ul className="space-y-4">
//         {talleres.map(t => (
//           <li
//             key={t.IdCourse}
//             className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
//           >
//             <div>
//               <p className="font-semibold text-gray-800 dark:text-gray-200">
//                 {t.Name_course}
//               </p>
//               <p className="text-sm text-gray-600 dark:text-gray-400">
//                 {new Date(t.Date_course).toLocaleDateString()}
//               </p>
//             </div>
//             <button
//               onClick={() => handleDownload(t.IdCourse, t.Name_course)}
//               className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
//             >
//               Descargar certificado
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default CertificadosGraduado;

// // const CertificadosGraduado = () => {
// //   return <div>CertificadosGraduado vista funcional</div>;
// // };

// // export default CertificadosGraduado;

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const BACKEND_URL = "http://localhost:3001";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [downloads, setDownloads] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadFeedback, setUploadFeedback] = useState("");
  const [info, setInfo] = useState("");

  // Fetch Downloads
  useEffect(() => {
    if (!user) return;
    fetch(`${BACKEND_URL}/api/downloads`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((list) => {
        if (Array.isArray(list)) setDownloads(list);
      })
      .catch(() => setInfo("Fehler beim Laden der Dateien"));
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4">Mitgliederbereich</h1>
          <p className="text-red-600">Bitte zuerst einloggen.</p>
        </div>
      </div>
    );
  }

  // Handle Download Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", uploadFile);
    try {
      const res = await fetch(`${BACKEND_URL}/api/downloads`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      setUploadFeedback("Datei erfolgreich hochgeladen.");
      setUploadFile(null);
      const r2 = await fetch(`${BACKEND_URL}/api/downloads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = await r2.json();
      if (Array.isArray(list)) setDownloads(list);
    } catch (err) {
      console.error(err);
      setUploadFeedback("Upload fehlgeschlagen.");
    }
  };

  // Handle Download Delete
  const handleDelete = async (filename) => {
    if (!window.confirm("Datei wirklich löschen?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/downloads/${filename}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Löschen fehlgeschlagen");
      // State aktualisieren: entferne die gelöschte Datei
      setDownloads(downloads.filter((dl) => dl.id !== filename));
      setUploadFeedback("Datei gelöscht.");
    } catch (err) {
      console.error(err);
      setUploadFeedback("Löschen fehlgeschlagen.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Mitgliederbereich</h1>

      {info && (
        <div className="bg-red-100 text-red-700 p-4 rounded">{info}</div>
      )}

      {/* Downloadbereich */}
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">
          Downloadbereich für alle Mitglieder
        </h2>
        {uploadFeedback && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {uploadFeedback}
          </div>
        )}
        <ul className="space-y-3 mb-6 max-h-60 overflow-auto">
          {downloads.length > 0 ? (
            downloads.map((dl) => (
              <li
                key={dl.id}
                className="bg-gray-100 p-3 rounded flex justify-between items-center"
              >
                <span className="font-medium text-gray-800">{dl.name}</span>
                <a
                  href={dl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Download
                </a>
                {user.role === "admin" && (
                  <button
                    onClick={() => handleDelete(dl.id)}
                    className="text-red-600 hover:underline"
                  >
                    Löschen
                  </button>
                )}
              </li>
            ))
          ) : (
            <li className="text-gray-500">Keine Dateien verfügbar.</li>
          )}
        </ul>
        <form onSubmit={handleUpload} className="flex items-center space-x-4">
          <input
            type="file"
            onChange={(e) => setUploadFile(e.target.files[0])}
            className="border rounded px-3 py-2"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            Hochladen
          </button>
        </form>
      </div>

      {/* Weitere Dashboard-Bereiche */}
      <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md">
        <p className="text-gray-700">
          Hier folgen Chat, Events und andere Funktionen.
        </p>
      </div>
    </div>
  );
}

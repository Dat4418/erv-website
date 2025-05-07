import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function EventCreatePage() {
  const { loggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [info, setInfo] = useState("");
  const [location, setLocation] = useState("");

  if (!loggedIn) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <p className="text-red-500">
          Du musst eingeloggt sein, um ein Event zu erstellen.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Zum Login
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3001/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, date, location }),
      });

      if (response.ok) {
        setInfo("Event erfolgreich erstellt!");
        setTitle("");
        setDescription("");
        setDate("");
        setLocation("");
        setTimeout(() => navigate("/events"), 1500);
      } else {
        const data = await response.json();
        setInfo(`Fehler: ${data.error || "Unbekannter Fehler"}`);
      }
    } catch (err) {
      console.error(err);
      setInfo("Verbindungsfehler zum Server.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Neues Event erstellen</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Titel"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          className="w-full border p-2 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Ort"
          className="w-full border p-2 rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <textarea
          placeholder="Beschreibung"
          className="w-full border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Event erstellen
        </button>
      </form>
      {info && <p className="mt-4 text-sm text-gray-700">{info}</p>}
    </div>
  );
}

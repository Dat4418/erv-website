import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function EventEditPage() {
  const { id } = useParams();
  const { loggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [info, setInfo] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Hole die Eventdaten zur Bearbeitung
    fetch(`http://localhost:3001/api/events/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Event nicht gefunden");
        }
        return res.json();
      })
      .then((data) => {
        setTitle(data.title);
        setDescription(data.description);
        setDate(data.date);
        setLocation(data.location || "");
      })
      .catch((err) => {
        console.error(err);
        setInfo("Fehler beim Laden des Events");
      });
  }, [id]);

  if (!loggedIn) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <p className="text-red-500">
          Du musst eingeloggt sein, um ein Event zu bearbeiten.
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
      const response = await fetch(`http://localhost:3001/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, date, location }),
      });
      if (response.ok) {
        setInfo("Event erfolgreich aktualisiert!");
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
      <h1 className="text-2xl font-bold mb-4">Event bearbeiten</h1>
      {info && <p className="text-red-500">{info}</p>}
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
          Änderungen speichern
        </button>
      </form>
    </div>
  );
}

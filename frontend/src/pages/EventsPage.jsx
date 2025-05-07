import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function EventsPage() {
  const { loggedIn } = useContext(AuthContext);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [info, setInfo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/events");
        if (response.ok) {
          const data = await response.json();
          const now = new Date();

          // Aufteilung in kommende und vergangene Events:
          const upcoming = data.filter((event) => new Date(event.date) >= now);
          const past = data.filter((event) => new Date(event.date) < now);

          // Sortiere kommende Events (frühestes zuerst)
          upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));

          // Sortiere vergangene Events (das zuletzt vergangene oben)
          past.sort((a, b) => new Date(b.date) - new Date(a.date));

          setUpcomingEvents(upcoming);
          setPastEvents(past);
        } else {
          setInfo("Fehler beim Laden der Events.");
        }
      } catch (err) {
        console.error("Fehler beim Abrufen:", err);
        setInfo("Verbindungsfehler zum Server.");
      }
    };

    fetchEvents();
  }, []);

  const handleDeleteEvent = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:3001/api/events/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setUpcomingEvents((prev) => prev.filter((e) => e.id !== id));
        setPastEvents((prev) => prev.filter((e) => e.id !== id));
      } else {
        const data = await response.json();
        alert(`Fehler beim Löschen: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Verbindungsfehler beim Löschen des Events.");
    }
  };

  return (
    <div className="py-12">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">
            <span className="bg-white/95 px-2 py-1 text-orange-500">
              Veranstaltungen
            </span>
          </h1>
          {loggedIn && (
            <button
              onClick={() => navigate("/events/new")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              + Neue Veranstaltung
            </button>
          )}
        </div>

        {info && <p className="text-red-600">{info}</p>}

        {/* Abschnitt: Kommende Veranstaltungen */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            <span className="bg-white/95 px-2 py-1 text-orange-500">
              Kommende Veranstaltungen
            </span>
          </h2>
          {upcomingEvents.length === 0 ? (
            <p className="text-gray-600">
              Für die Zukunft sind keine Veranstaltungen eingetragen.
            </p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <li
                  key={event.id}
                  className="p-6 bg-white/95 border shadow hover:bg-gray-50 transition"
                >
                  <h2 className="text-xl font-semibold mb-1">{event.title}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleString()}
                  </p>
                  {event.location && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        event.location
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {event.location}
                    </a>
                  )}
                  <p className="mt-2 text-gray-700">{event.description}</p>
                  {loggedIn && (
                    <div className="mt-4 flex space-x-2">
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        onClick={() => navigate(`/events/edit/${event.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Abschnitt: Vergangene Veranstaltungen */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            <span className="bg-white/95 px-2 py-1 text-orange-500">
              Vergangene Veranstaltungen
            </span>
          </h2>
          {pastEvents.length === 0 ? (
            <p className="text-gray-600">
              Es sind keine vergangenen Veranstaltungen verfügbar.
            </p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <li
                  key={event.id}
                  className="p-6 bg-white/95 border shadow hover:bg-gray-50 transition"
                >
                  <h2 className="text-xl font-semibold mb-1">{event.title}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleString()}
                  </p>
                  {event.location && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        event.location
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {event.location}
                    </a>
                  )}
                  <p className="mt-2 text-gray-700">{event.description}</p>
                  {loggedIn && (
                    <div className="mt-4 flex space-x-2">
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        onClick={() => navigate(`/events/edit/${event.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

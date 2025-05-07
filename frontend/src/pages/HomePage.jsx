export default function HomePage() {
  return (
    <div className="py-12 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-800">
        <span className="bg-white/95 px-2 py-1 text-orange-500">
          Willkommen beim Erfurter Rollsportverein e.V.
        </span>
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-6">
        <span className="bg-white/95 px-2 py-1 text-orange-500">
          <b>
            Hier entsteht ein DIY-Skatepark im Erfurter Norden – mit
            Community-Beteiligung, Leidenschaft & lokalem Engagement.
          </b>
        </span>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white/95 shadow-md p-6 border">
          <h2 className="text-xl font-semibold mb-2">
            🏗 <span className="text-orange-500">Baufortschritt</span>
          </h2>
          <p className="text-sm text-gray-700">
            Erfahre mehr über den aktuellen Stand unseres DIY-Projekts und wie
            du dich einbringen kannst.
          </p>
        </div>
        <div className="bg-white/95 shadow-md p-6 border">
          <h2 className="text-xl font-semibold mb-2">
            📅 <span className="text-orange-500">Events & Sessions</span>
          </h2>
          <p className="text-sm text-gray-700">
            Contests, Workshops und offene Sessions – alle Termine findest du in
            unserem Eventbereich.
          </p>
        </div>
        <div className="bg-white/95 shadow-md p-6 border">
          <h2 className="text-xl font-semibold mb-2">
            🤝 <span className="text-orange-500">Verein & Engagement</span>
          </h2>
          <p className="text-sm text-gray-700">
            Werde Teil unseres Vereins oder unterstütze uns als Partner –
            gemeinsam schaffen wir Raum für Rollsport.
          </p>
        </div>
      </div>
    </div>
  );
}

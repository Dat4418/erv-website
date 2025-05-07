import React from "react";

export default function AboutPage() {
  return (
    <div className="py-12">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Einleitung */}
        <div className="bg-white/95 p-6">
          <h1 className="text-4xl font-extrabold text-orange-500">Über uns</h1>
          <p className="mt-4 text-lg text-gray-700">
            Willkommen beim Erfurter Rollsportverein e.V. – deinem Zuhause für
            alle Formen des Rollsports. Erfahre mehr über unser
            Selbstverständnis, unseren Vorstand, lade unsere Satzung herunter
            oder werde Mitglied!
          </p>
        </div>

        {/* Gruppe: Selbstverständnis & Vorstand */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Selbstverständnis */}
          <section
            id="selbstverstaendnis"
            className="flex-1 prose max-w-none bg-white/95 p-6"
          >
            <h2 className="text-orange-500 font-extrabold py-1">
              Unser Selbstverständnis
            </h2>
            <p>
              Der Erfurter Rollsportverein e.V. fördert den Rollsport in allen
              Facetten – von Inlineskating und Skateboarding bis hin zu Roller
              Derby und Urban-Scootering. Unser Ziel ist es, Anfänger:innen und
              erfahrenen Sportler:innen gleichermaßen eine sichere und
              inspirierende Umgebung zu bieten, in der Gemeinschaft, Fairness
              und Respekt an oberster Stelle stehen.
            </p>
          </section>

          {/* Vorstand */}
          <section
            id="vorstand"
            className="flex-1 prose max-w-none bg-white/95 p-6"
          >
            <h2 className="text-orange-500 font-extrabold py-1">Vorstand</h2>
            <ul className="list-disc list-inside">
              <li>
                <strong>Vorsitzende:r:</strong> Max Mustermann
              </li>
              <li>
                <strong>Stellvertretung:</strong> Erika Beispiel
              </li>
              <li>
                <strong>Schatzmeister:in:</strong> Janine Musterfrau
              </li>
              <li>
                <strong>Schriftführer:in:</strong> Peter Muster
              </li>
            </ul>
          </section>
        </div>

        {/* Gruppe: Satzung & Mitgliedsantrag */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Satzung */}
          <section
            id="satzung"
            className="flex-1 prose max-w-none bg-white/95 p-6"
          >
            <h2 className="text-orange-500 font-extrabold py-1">Satzung</h2>
            <p>
              Unsere Satzung regelt die Rechts- und Organisationsstruktur des
              Vereins.
            </p>
            <a
              href="/pdfs/Satzung_ErfurtRV.pdf"
              download
              className="inline-block mt-4 px-5 py-3 bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
            >
              Satzung herunterladen (PDF)
            </a>
          </section>

          {/* Mitgliedsantrag */}
          <section
            id="mitgliedsantrag"
            className="flex-1 prose max-w-none bg-white/95 p-6"
          >
            <h2 className="text-orange-500 font-extrabold py-1">
              Mitgliedsantrag
            </h2>
            <p>
              Möchtest du Teil unserer Gemeinschaft werden? Fülle den
              Mitgliedsantrag aus und schicke ihn ausgefüllt zurück.
            </p>
            <a
              href="/pdfs/Mitgliedsantrag_ErfurtRV.pdf"
              download
              className="inline-block mt-4 px-5 py-3 bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition"
            >
              Mitgliedsantrag herunterladen (PDF)
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}

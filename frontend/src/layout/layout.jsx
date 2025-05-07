import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Hier definieren wir den Container für den Inhalt */}
      <main className="flex-1">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-6">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

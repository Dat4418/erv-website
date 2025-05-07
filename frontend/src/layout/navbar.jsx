import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Calendar, Home, Users, LogIn, Newspaper } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { loggedIn, logout } = useContext(AuthContext);

  /* Anzeige der Navigation */
  const navItems = [
    { to: "/", label: "Home", icon: <Home size={18} /> },
    { to: "/events", label: "Events", icon: <Calendar size={18} /> },
    { to: "/blog", label: "Blog", icon: <Newspaper size={18} /> },
    { to: "/verein", label: "Verein", icon: <Users size={18} /> },
  ];

  if (loggedIn) {
    navItems.push({
      to: "/dashboard",
      label: "Dashboard",
      icon: <Users size={18} />,
    });
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full py-4">
      {/* Oberer Bereich: Enthält den zentrierten Navbar-Inhalt */}
      <div className="max-w-screen-xl mx-auto bg-white/95 px-4 py-2 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl">
          <span className="text-orange-500">Erfurter Rollsportverein</span>
        </Link>
        {/* Desktop-Menü */}
        <div className="hidden md:flex space-x-6 items-center">
          {navItems.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className="px-2 py-1 text-orange-500 flex items-center space-x-1 hover:text-gray-300"
            >
              {icon}
              <span>{label}</span>
            </Link>
          ))}
          {loggedIn && (
            <button
              onClick={handleLogout}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Logout
            </button>
          )}
        </div>
        {/* Mobile-Menü Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobiler Dropdown-Menübereich */}
      {isOpen && (
        <div className="md:hidden mt-4">
          <div className="max-w-screen-xl py-3 mx-auto bg-white/95 px-4 flex flex-col space-y-3">
            {navItems.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className="text-orange-500 py-2 flex items-center space-x-2 hover:text-gray-300"
              >
                {icon}
                <span>{label}</span>
              </Link>
            ))}
            {loggedIn && (
              <button
                onClick={handleLogout}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

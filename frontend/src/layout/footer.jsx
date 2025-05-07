import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Footer() {
  const { loggedIn } = useContext(AuthContext);

  return (
    <footer className="bg-black text-white text-sm py-4">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto px-4">
        <div>
          &copy; {new Date().getFullYear()} Erfurter Rollsportverein e.V.
        </div>
        <div className="flex gap-4 items-center">
          {loggedIn ? (
            ""
          ) : (
            <a href="/login" className="text-blue-400 hover:underline">
              Login
            </a>
          )}
          <a href="/datenschutz" className="hover:underline">
            Datenschutz
          </a>
          <a href="/impressum" className="hover:underline">
            Impressum
          </a>
        </div>
      </div>
    </footer>
  );
}

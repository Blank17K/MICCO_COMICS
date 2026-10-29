import { useNavigate, useLocation } from "react-router-dom";
import "../styling/textStyle.css";
import "bootstrap/dist/css/bootstrap.min.css";

const LINKS = [
  { key: "home", label: "Home", path: "/home" },
  { key: "community", label: "Community", path: "/community" },
  { key: "profile", label: "Profile", path: "/profile" },
];

export default function Nav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="section appNav">
      {LINKS.map(({ key, label, path }) => (
        <button
          key={key}
          className={`btn_act ${pathname.startsWith(path) ? "active" : ""}`}
          onClick={() => navigate(path)}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

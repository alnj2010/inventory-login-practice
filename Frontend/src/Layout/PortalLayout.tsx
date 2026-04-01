import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";
import { CurrencyWidget } from "../Layout/CurrencyWidget"; // <--- Importamos el widget
import "../Stily/PortalLayout.css";

interface PortalLayoutProps {
  children: ReactNode;
}

export default function PortalLayout({ children }: PortalLayoutProps) {
  const { signOut, user } = useAuth();

  return (
    <>
      <header className="navbar">
        <nav>
          <ul>
            <Link to="/dashboard" className="nav-link-button">
              Dashboard
            </Link>
          </ul>
        </nav>

        <div
          className="navbar-user-section"
          style={{ display: "flex", alignItems: "center", gap: "20px" }}
        >
          {/* INSERTAMOS EL WIDGET AQUÍ */}
          <CurrencyWidget />

          <div className="user-info">
            <span>
              Hola, <strong>{user?.username}</strong>
            </span>
            <span
              className="user-role"
              style={{ fontSize: "0.8rem", display: "block", color: "#666" }}
            >
              ({user?.role})
            </span>
          </div>

          <button className="btn-logout" onClick={signOut}>
            Cerrar Sesión
          </button>
        </div>
      </header>
      <main className="portal-main-content">{children}</main>
    </>
  );
}

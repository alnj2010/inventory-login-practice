import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";
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
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </nav>
        <div className="navbar-user-section">
          <span>Hola, {user?.username}</span>
          <button className="btn-logout" onClick={signOut}>
            Cerrar Sesión
          </button>
        </div>
      </header>
      <main>{children}</main>
    </>
  );
}

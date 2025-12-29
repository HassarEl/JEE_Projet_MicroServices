import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, userId, isAuthenticated, logout } = useAuth();
  const role = user?.role; // USER | ORGANIZER | ADMIN

  const doLogout = () => {
    logout();
    navigate("/login");
  };

  return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">Ticketing</Link>

          <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#nav"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div id="nav" className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto">

              {/* 🌍 VISITEUR (non connecté) */}
              {!isAuthenticated && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/events">Événements</NavLink>
                  </li>
              )}

              {/* 👤 USER */}
              {isAuthenticated && role === "USER" && (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/events">Événements</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/me/reservations">Mes réservations</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/me/notifications">Notifications</NavLink>
                    </li>
                  </>
              )}

              {/* 🎤 ORGANIZER */}
              {isAuthenticated && role === "ORGANIZER" && (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/organizer">Dashboard</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/organizer/events">Mes événements</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/organizer/events/new">Créer événement</NavLink>
                    </li>
                  </>
              )}

              {/* 🛠 ADMIN */}
              {isAuthenticated && role === "ADMIN" && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin">Admin</NavLink>
                  </li>
              )}
            </ul>

            {/* 🔐 AUTH ACTIONS */}
            <div className="d-flex gap-2">
              {!isAuthenticated ? (
                  <>
                    <Link className="btn btn-outline-light btn-sm" to="/login">Connexion</Link>
                    <Link className="btn btn-warning btn-sm" to="/register">Inscription</Link>
                  </>
              ) : (
                  <>
                <span className="text-white small align-self-center">
                  User #{userId} • <span className="badge bg-secondary">{role}</span>
                </span>
                    <button
                        className="btn btn-outline-light btn-sm"
                        onClick={doLogout}
                    >
                      Déconnexion
                    </button>
                  </>
              )}
            </div>
          </div>
        </div>
      </nav>
  );
}

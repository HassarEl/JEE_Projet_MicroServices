import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <h2 className="fw-bold mb-0">Dashboard Admin</h2>
        <div className="small text-muted">CRUD Events • Suivi Réservations • Paiements</div>
      </div>

      <div className="row g-3">
        <div className="col-md-3">
          <div className="list-group shadow-sm">
            <NavLink to="/admin/events" className="list-group-item list-group-item-action">Gestion Événements</NavLink>
            <NavLink to="/admin/reservations" className="list-group-item list-group-item-action">Réservations</NavLink>
          </div>
        </div>
        <div className="col-md-9">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import http from "../api/http";
import { useAuth } from "../auth/AuthProvider";
import Toast from "../components/Toast";

export default function MyReservations() {
  const { userId, isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState({ type: "info", message: "" });

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!userId) return;

    (async () => {
      try {
        const { data } = await http.get(`/reservation-service/api/reservations/user/${userId}`);
        setItems(data || []);
      } catch (e) {
        setToast({ type: "error", message: "Impossible de charger vos réservations." });
      }
    })();
  }, [isAuthenticated, userId]);

  return (
      <div className="container py-4">
        <h2 className="fw-bold mb-3">Mes réservations</h2>
        <Toast {...toast} onClose={() => setToast({ ...toast, message: "" })} />

        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table mb-0">
              <thead>
              <tr>
                <th>ID</th>
                <th>Event ID</th>
                <th>Tickets</th>
                <th>Date</th>
                <th>Status</th>
                <th />
              </tr>
              </thead>
              <tbody>
              {items.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.eventId}</td>
                    <td>{r.ticketCount}</td>
                    <td className="small text-muted">{String(r.reservationDate || "").replace("T", " ")}</td>
                    <td>
                    <span className={`badge ${
                        r.status === "PAID"
                            ? "bg-success"
                            : r.status === "RESERVED"
                                ? "bg-warning text-dark"
                                : "bg-secondary"
                    }`}>
                      {r.status}
                    </span>
                    </td>
                    <td className="text-end">
                      {r.status === "RESERVED" ? (
                          <Link className="btn btn-dark btn-sm" to={`/payment/${r.id}`}>Payer</Link>
                      ) : (
                          <span className="text-muted small">—</span>
                      )}
                    </td>
                  </tr>
              ))}

              {!items.length && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">Aucune réservation</td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
}

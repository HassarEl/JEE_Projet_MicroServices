import React, { useEffect, useState } from "react";
import http from "../../api/http";
import Toast from "../../components/Toast";

export default function AdminReservations() {
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState({ type: "info", message: "" });

  const load = async () => {
    try {
      const { data } = await http.get("/reservation-service/api/reservations");
      setItems(data);
    } catch {
      setToast({ type: "error", message: "Erreur chargement réservations." });
    }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await http.put(`/reservation-service/api/reservations/${id}/status?status=${status}`);
      setToast({ type: "success", message: "Statut mis à jour." });
      load();
    } catch {
      setToast({ type: "error", message: "Update status impossible." });
    }
  };

  return (
    <div>
      <Toast {...toast} onClose={() => setToast({ ...toast, message: "" })} />

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Event</th>
                <th>Tickets</th>
                <th>Status</th>
                <th>Date</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.userId}</td>
                  <td>{r.eventId}</td>
                  <td>{r.ticketCount}</td>
                  <td><span className="badge bg-secondary">{r.status}</span></td>
                  <td className="small text-muted">{String(r.reservationDate || "").replace("T", " ")}</td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-dark" onClick={() => updateStatus(r.id, "RESERVED")}>RESERVED</button>
                      <button className="btn btn-outline-success" onClick={() => updateStatus(r.id, "PAID")}>PAID</button>
                      <button className="btn btn-outline-danger" onClick={() => updateStatus(r.id, "CANCELLED")}>CANCEL</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan="7" className="text-center text-muted py-4">Aucune réservation</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

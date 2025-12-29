import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import http from "../api/http";
import Toast from "../components/Toast";
import { useAuth } from "../auth/AuthProvider";

export default function Events() {
  const { isOrganizer } = useAuth();

  const [events, setEvents] = useState([]);
  const [q, setQ] = useState("");
  const [toast, setToast] = useState({ type: "info", message: "" });

  const load = async () => {
    try {
      const { data } = await http.get("/event-service/api/events");
      setEvents(data);
    } catch (e) {
      setToast({ type: "error", message: "Impossible de charger les événements." });
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return events;
    return events.filter(ev =>
        (ev.name || "").toLowerCase().includes(s) ||
        (ev.location || "").toLowerCase().includes(s) ||
        (ev.organizerName || ev.organizer || "").toLowerCase().includes(s)
    );
  }, [events, q]);

  return (
      <div className="container py-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
          <div>
            <h2 className="fw-bold mb-0">Événements</h2>
            <div className="text-muted small">
              {isOrganizer ? "Mode organisateur : consultation uniquement." : "Réservez jusqu’à 4 tickets."}
            </div>
          </div>
          <div style={{ minWidth: 280 }}>
            <input value={q} onChange={(e) => setQ(e.target.value)} className="form-control" placeholder="Rechercher..." />
          </div>
        </div>

        <Toast {...toast} onClose={() => setToast({ ...toast, message: "" })} />

        <div className="row g-3">
          {filtered.map(ev => (
              <div className="col-12 col-md-6 col-lg-4" key={ev.id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <h5 className="card-title fw-bold">{ev.name}</h5>
                      <span className="badge bg-secondary">{ev.totalTickets ?? "?"} tickets</span>
                    </div>
                    <div className="small text-muted">{ev.date} • {ev.location}</div>

                    <div className="mt-2 small">
                      <div><b>Organisateur:</b> {ev.organizerName || ev.organizer}</div>
                      <div><b>Prix:</b> {ev.price ?? 0} MAD</div>
                    </div>

                    <div className="mt-3 d-flex gap-2">
                      <Link className="btn btn-dark btn-sm" to={`/events/${ev.id}`}>
                        {isOrganizer ? "Détails" : "Détails & Réserver"}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
          ))}

          {!filtered.length && (
              <div className="col-12">
                <div className="alert alert-light border">Aucun événement.</div>
              </div>
          )}
        </div>
      </div>
  );
}

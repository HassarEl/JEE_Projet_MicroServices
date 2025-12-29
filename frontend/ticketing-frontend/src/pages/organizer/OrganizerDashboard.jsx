import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import http from "../../api/http";
import { useAuth } from "../../auth/AuthProvider";
import Toast from "../../components/Toast";

export default function OrganizerDashboard() {
    const { userId } = useAuth();
    const [events, setEvents] = useState([]);
    const [toast, setToast] = useState({ type: "info", message: "" });

    const load = async () => {
        try {
            const { data } = await http.get(`/event-service/api/events/organizer/${Number(userId)}`);
            setEvents(data || []);
        } catch {
            setToast({ type: "error", message: "Impossible de charger vos événements." });
        }
    };

    useEffect(() => { load(); }, [userId]);

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <div>
                    <h2 className="fw-bold mb-0">Dashboard Organisateur</h2>
                    <div className="text-muted small">Gérez vos événements et suivez les tickets.</div>
                </div>
                <Link className="btn btn-dark" to="/organizer/events/new">+ Créer un événement</Link>
            </div>

            <Toast {...toast} onClose={() => setToast({ ...toast, message: "" })} />

            <div className="card shadow-sm">
                <div className="table-responsive">
                    <table className="table mb-0">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Date</th>
                            <th>Lieu</th>
                            <th>Tickets restants</th>
                            <th>Prix</th>
                        </tr>
                        </thead>
                        <tbody>
                        {events.map(ev => (
                            <tr key={ev.id}>
                                <td>{ev.id}</td>
                                <td>{ev.name}</td>
                                <td>{String(ev.date || "")}</td>
                                <td>{ev.location}</td>
                                <td><span className="badge bg-secondary">{ev.totalTickets}</span></td>
                                <td>{ev.price ?? 0} MAD</td>
                            </tr>
                        ))}
                        {!events.length && (
                            <tr>
                                <td colSpan="6" className="text-center text-muted py-4">Aucun événement.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="small text-muted mt-3">
                Astuce: si tu veux “tickets vendus”, il faut une table de stats (réservations payées) ou un endpoint d’agrégation.
            </div>
        </div>
    );
}

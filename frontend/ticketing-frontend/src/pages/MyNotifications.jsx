import React, { useEffect, useState } from "react";
import http from "../api/http";
import { useAuth } from "../auth/AuthProvider";
import Toast from "../components/Toast";
import { getErrorMessage } from "../utils/errorMessage";

export default function MyNotifications() {
    const { userId, isAuthenticated } = useAuth();
    const [items, setItems] = useState([]);
    const [toast, setToast] = useState({ type: "info", message: "" });

    useEffect(() => {
        if (!isAuthenticated) return;

        const uid = Number(userId);
        if (!uid || Number.isNaN(uid)) return;

        (async () => {
            try {
                const { data } = await http.get(`/notification-service/api/notifications/user/${uid}`);
                // tri récent -> ancien
                const sorted = (data || []).slice().sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
                setItems(sorted);
            } catch (e) {
                setToast({ type: "error", message: getErrorMessage(e, "Impossible de charger vos notifications.") });
            }
        })();
    }, [isAuthenticated, userId]);

    return (
        <div className="container py-4" style={{ maxWidth: 900 }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold mb-0">Mes notifications</h2>
            </div>

            <Toast {...toast} onClose={() => setToast({ ...toast, message: "" })} />

            <div className="card shadow-sm">
                <div className="table-responsive">
                    <table className="table mb-0">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Titre</th>
                            <th>Message</th>
                            <th>Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((n) => (
                            <tr key={n.id}>
                                <td>{n.id}</td>
                                <td>
                    <span className={`badge ${n.type === "EMAIL" ? "bg-primary" : "bg-secondary"}`}>
                      {n.type}
                    </span>
                                </td>
                                <td className="fw-semibold">{n.title}</td>
                                <td>{n.message}</td>
                                <td className="small text-muted">{String(n.createdAt || "").replace("T", " ")}</td>
                            </tr>
                        ))}
                        {!items.length && (
                            <tr>
                                <td colSpan="5" className="text-center text-muted py-4">
                                    Aucune notification
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

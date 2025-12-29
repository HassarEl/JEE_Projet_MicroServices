import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import http from "../api/http";
import { useAuth } from "../auth/AuthProvider";
import Toast from "../components/Toast";
import { getErrorMessage } from "../utils/errorMessage";

export default function EventDetails() {
  const { id } = useParams();
  const { userId, user, isAuthenticated } = useAuth();
  const role = user?.role;

  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({ defaultValues: { ticketCount: 1 } });

  const [event, setEvent] = useState(null);
  const [toast, setToast] = useState({ type: "info", message: "" });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await http.get(`/event-service/api/events/${id}`);
        setEvent(data);
      } catch {
        setToast({ type: "error", message: "Événement introuvable." });
      }
    })();
  }, [id]);

  const onReserve = async (values) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // ✅ ORGANIZER/ADMIN ne réserve pas
    if (role !== "USER") {
      setToast({ type: "error", message: "Seuls les utilisateurs (USER) peuvent réserver." });
      return;
    }

    const uid = Number(userId);
    if (!uid || Number.isNaN(uid)) {
      setToast({ type: "error", message: "Utilisateur non détecté. Reconnectez-vous." });
      navigate("/login");
      return;
    }

    try {
      const payload = { userId: uid, eventId: Number(id), ticketCount: Number(values.ticketCount) };
      const { data } = await http.post("/reservation-service/api/reservations", payload);

      if (data?.status?.startsWith("PENDING")) {
        setToast({ type: "warning", message: "Services indisponibles. Réservation en attente (fallback)." });
        navigate("/me/reservations");
        return;
      }

      setToast({ type: "success", message: "Réservation créée. Procédez au paiement." });
      setTimeout(() => navigate(`/payment/${data.id}`), 700);
    } catch (e) {
      setToast({ type: "error", message: getErrorMessage(e, "Erreur lors de la réservation.") });
    }
  };

  if (!event) {
    return (
        <div className="container py-4">
          <Toast {...toast} onClose={() => setToast({ ...toast, message: "" })} />
          <div className="text-muted">Chargement...</div>
        </div>
    );
  }

  const canReserve = isAuthenticated && role === "USER";

  return (
      <div className="container py-4" style={{ maxWidth: 860 }}>
        <Toast {...toast} onClose={() => setToast({ ...toast, message: "" })} />

        <div className="card shadow-sm">
          <div className="card-body">
            <div className="d-flex flex-wrap justify-content-between gap-2">
              <div>
                <h3 className="fw-bold mb-0">{event.name}</h3>
                <div className="text-muted small">{event.date} • {event.location}</div>
              </div>
              <div className="text-end">
                <div className="badge bg-secondary">{event.totalTickets ?? "?"} tickets</div>
                <div className="fw-bold">{event.price ?? 0} MAD</div>
              </div>
            </div>

            <hr />

            <div className="row g-3">
              <div className="col-md-6">
                <div><b>Organisateur:</b> {event.organizer || `#${event.organizerId}`}</div>
                <div><b>Participants:</b> {(event.participants || []).join(" vs ") || "-"}</div>
              </div>

              <div className="col-md-6">
                {!canReserve ? (
                    <div className="alert alert-light border">
                      {isAuthenticated
                          ? "Réservation désactivée pour ORGANIZER/ADMIN."
                          : "Connectez-vous pour réserver."}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onReserve)} className="p-3 border rounded">
                      <div className="mb-2 small text-muted">Max 4 tickets / réservation</div>
                      <label className="form-label">Nombre de tickets</label>
                      <input
                          type="number"
                          className="form-control mb-3"
                          min={1}
                          max={4}
                          {...register("ticketCount", { required: true, min: 1, max: 4 })}
                      />
                      <button className="btn btn-dark w-100">Réserver</button>
                    </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

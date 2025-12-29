import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import http from "../api/http";
import Toast from "../components/Toast";
import { getErrorMessage } from "../utils/errorMessage";
import { useAuth } from "../auth/AuthProvider";

export default function Payment() {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const { isOrganizer } = useAuth();

  const [reservation, setReservation] = useState(null);
  const [toast, setToast] = useState({ type: "info", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOrganizer) {
      setToast({ type: "warning", message: "Un organisateur ne peut pas payer des réservations." });
      navigate("/events");
      return;
    }

    (async () => {
      try {
        const { data } = await http.get(`/reservation-service/api/reservations/${reservationId}`);
        setReservation(data);
      } catch (e) {
        setToast({ type: "error", message: "Réservation introuvable." });
      }
    })();
  }, [reservationId, isOrganizer, navigate]);

  const pay = async () => {
    setLoading(true);
    try {
      const { data } = await http.post(`/payment-service/api/payments`, { reservationId: Number(reservationId) });

      setToast({
        type: data.status === "SUCCESS" ? "success" : "error",
        message: `Paiement: ${data.status} • Total: ${data.totalAmount} MAD`,
      });

      setTimeout(() => navigate("/me/reservations"), 900);
    } catch (e) {
      setToast({ type: "error", message: getErrorMessage(e, "Erreur paiement.") });
    } finally {
      setLoading(false);
    }
  };

  if (!reservation) {
    return (
        <div className="container py-4">
          <Toast {...toast} onClose={() => setToast({ ...toast, message: "" })} />
          <div className="text-muted">Chargement...</div>
        </div>
    );
  }

  return (
      <div className="container py-4" style={{ maxWidth: 720 }}>
        <h2 className="fw-bold mb-3">Paiement</h2>
        <Toast {...toast} onClose={() => setToast({ ...toast, message: "" })} />

        <div className="card shadow-sm">
          <div className="card-body">
            <div className="row g-2">
              <div className="col-md-6">
                <div><b>Reservation ID:</b> {reservation.id}</div>
                <div><b>Event ID:</b> {reservation.eventId}</div>
                <div><b>Tickets:</b> {reservation.ticketCount}</div>
              </div>
              <div className="col-md-6">
                <div><b>Status:</b> <span className="badge bg-warning text-dark">{reservation.status}</span></div>
                <div className="small text-muted">Le total est calculé côté backend (Payment-Service).</div>
              </div>
            </div>

            <hr />

            <button disabled={loading} className="btn btn-dark w-100" onClick={pay}>
              {loading ? "Paiement en cours..." : "Payer maintenant"}
            </button>
          </div>
        </div>
      </div>
  );
}

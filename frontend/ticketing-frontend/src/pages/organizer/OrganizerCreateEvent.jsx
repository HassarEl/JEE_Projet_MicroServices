import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import http from "../../api/http";
import { useAuth } from "../../auth/AuthProvider";
import Toast from "../../components/Toast";
import { getErrorMessage } from "../../utils/errorMessage";

export default function OrganizerCreateEvent() {
    const { userId } = useAuth();
    const navigate = useNavigate();
    const [toast, setToast] = useState({ type: "info", message: "" });

    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm({
        defaultValues: {
            name: "",
            date: "",
            location: "",
            organizer: "",
            totalTickets: 100,
            price: 50,
            participantsText: ""
        }
    });

    const onSubmit = async (values) => {
        const oid = Number(userId);
        if (!oid || Number.isNaN(oid)) {
            setToast({ type: "error", message: "Organizer non détecté. Reconnectez-vous." });
            navigate("/login");
            return;
        }

        try {
            const participants = (values.participantsText || "")
                .split(",")
                .map(s => s.trim())
                .filter(Boolean);

            const payload = {
                name: values.name,
                date: values.date, // "YYYY-MM-DD" OK
                location: values.location,
                organizerId: oid,              // ✅ IMPORTANT
                organizer: values.organizer || `Organizer #${oid}`,
                totalTickets: Number(values.totalTickets),
                price: Number(values.price),
                participants
            };

            await http.post("/event-service/api/events", payload);
            setToast({ type: "success", message: "Événement créé avec succès." });

            setTimeout(() => navigate("/organizer"), 700);
        } catch (e) {
            setToast({ type: "error", message: getErrorMessage(e, "Erreur lors de la création.") });
        }
    };

    return (
        <div className="container py-4" style={{ maxWidth: 860 }}>
            <h2 className="fw-bold mb-3">Créer un événement</h2>
            <Toast {...toast} onClose={() => setToast({ ...toast, message: "" })} />

            <div className="card shadow-sm">
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)} className="row g-3">

                        <div className="col-md-6">
                            <label className="form-label">Nom</label>
                            <input
                                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                {...register("name", { required: "Nom obligatoire" })}
                            />
                            {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Date</label>
                            <input
                                type="date"
                                className={`form-control ${errors.date ? "is-invalid" : ""}`}
                                {...register("date", { required: "Date obligatoire" })}
                            />
                            {errors.date && <div className="invalid-feedback">{errors.date.message}</div>}
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Lieu</label>
                            <input
                                className={`form-control ${errors.location ? "is-invalid" : ""}`}
                                {...register("location", { required: "Lieu obligatoire" })}
                            />
                            {errors.location && <div className="invalid-feedback">{errors.location.message}</div>}
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Organisateur (nom affiché)</label>
                            <input className="form-control" {...register("organizer")} placeholder="Ex: Ticketing Org" />
                            <div className="form-text">Si vide: “Organizer #{userId}” sera utilisé.</div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Tickets (stock)</label>
                            <input
                                type="number"
                                min={1}
                                className={`form-control ${errors.totalTickets ? "is-invalid" : ""}`}
                                {...register("totalTickets", { required: true, min: 1 })}
                            />
                            {errors.totalTickets && <div className="invalid-feedback">totalTickets invalide</div>}
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Prix (MAD)</label>
                            <input
                                type="number"
                                min={0}
                                step="0.01"
                                className={`form-control ${errors.price ? "is-invalid" : ""}`}
                                {...register("price", { required: true, min: 0 })}
                            />
                            {errors.price && <div className="invalid-feedback">price invalide</div>}
                        </div>

                        <div className="col-12">
                            <label className="form-label">Participants (séparés par virgule)</label>
                            <input className="form-control" {...register("participantsText")} placeholder="Ex: Team A, Team B" />
                        </div>

                        <div className="col-12 d-flex gap-2">
                            <button disabled={isSubmitting} className="btn btn-dark">
                                {isSubmitting ? "Création..." : "Créer"}
                            </button>
                            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/organizer")}>
                                Annuler
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

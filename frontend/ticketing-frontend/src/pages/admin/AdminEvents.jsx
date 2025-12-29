import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import http from "../../api/http";
import Toast from "../../components/Toast";

export default function AdminEvents() {
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState({ type: "info", message: "" });
  const [editing, setEditing] = useState(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: "", date: "", location: "", organizer: "", totalTickets: 40000, price: 100, participantsText: "" },
  });

  const load = async () => {
    try {
      const { data } = await http.get("/event-service/api/events");
      setItems(data);
    } catch {
      setToast({ type: "error", message: "Erreur chargement events." });
    }
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (values) => {
    try {
      const participants = values.participantsText
        ? values.participantsText.split(",").map(s => s.trim()).filter(Boolean)
        : [];

      const payload = {
        name: values.name,
        date: values.date,
        location: values.location,
        organizer: values.organizer,
        totalTickets: Number(values.totalTickets),
        price: Number(values.price),
        participants,
      };

      if (editing) {
        await http.put(`/event-service/api/events/${editing.id}`, payload);
        setToast({ type: "success", message: "Event modifié." });
      } else {
        await http.post("/event-service/api/events", payload);
        setToast({ type: "success", message: "Event créé." });
      }
      reset();
      setEditing(null);
      load();
    } catch (e) {
      setToast({ type: "error", message: e?.response?.data?.message || "Erreur save event." });
    }
  };

  const edit = (ev) => {
    setEditing(ev);
    reset({
      name: ev.name || "",
      date: ev.date || "",
      location: ev.location || "",
      organizer: ev.organizer || "",
      totalTickets: ev.totalTickets ?? 40000,
      price: ev.price ?? 100,
      participantsText: (ev.participants || []).join(", "),
    });
  };

  const del = async (id) => {
    if (!confirm("Supprimer cet événement ?")) return;
    try {
      await http.delete(`/event-service/api/events/${id}`);
      setToast({ type: "success", message: "Event supprimé." });
      load();
    } catch {
      setToast({ type: "error", message: "Suppression impossible." });
    }
  };

  return (
    <div>
      <Toast {...toast} onClose={() => setToast({ ...toast, message: "" })} />

      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <h5 className="fw-bold mb-3">{editing ? `Modifier Event #${editing.id}` : "Créer un Event"}</h5>
          <form onSubmit={handleSubmit(onSubmit)} className="row g-2">
            <div className="col-md-6">
              <label className="form-label">Nom</label>
              <input className="form-control" {...register("name", { required: true })} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Date</label>
              <input type="date" className="form-control" {...register("date", { required: true })} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Tickets</label>
              <input type="number" className="form-control" {...register("totalTickets", { required: true, min: 1 })} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Lieu</label>
              <input className="form-control" {...register("location", { required: true })} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Organisateur</label>
              <input className="form-control" {...register("organizer", { required: true })} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Prix (MAD)</label>
              <input type="number" className="form-control" {...register("price", { required: true, min: 0 })} />
            </div>
            <div className="col-12">
              <label className="form-label">Participants (séparés par virgule)</label>
              <input className="form-control" placeholder="Equipe A, Equipe B" {...register("participantsText")} />
            </div>
            <div className="col-12 d-flex gap-2">
              <button className="btn btn-dark">{editing ? "Enregistrer" : "Créer"}</button>
              {editing && (
                <button type="button" className="btn btn-outline-secondary" onClick={() => { setEditing(null); reset(); }}>
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Date</th>
                <th>Lieu</th>
                <th>Tickets</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map(ev => (
                <tr key={ev.id}>
                  <td>{ev.id}</td>
                  <td>{ev.name}</td>
                  <td>{ev.date}</td>
                  <td>{ev.location}</td>
                  <td>{ev.totalTickets}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-dark me-2" onClick={() => edit(ev)}>Éditer</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => del(ev.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan="6" className="text-center text-muted py-4">Aucun événement</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

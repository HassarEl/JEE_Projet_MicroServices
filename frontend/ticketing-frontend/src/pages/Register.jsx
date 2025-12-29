import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { getErrorMessage } from "../utils/errorMessage";

export default function Register() {
  const { register: reg, handleSubmit } = useForm();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const onSubmit = async (values) => {
    setError("");

    if (values.password !== values.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      await register({
        username: values.username,
        email: values.email,
        password: values.password,
        role: values.role || "USER",
      });

      navigate("/login");
    } catch (e) {
      setError(getErrorMessage(e, "Erreur inscription"));
    }
  };

  return (
      <div className="container py-5" style={{ maxWidth: 520 }}>
        <h2 className="fw-bold mb-3">Inscription</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="card card-body shadow-sm">
          <label className="form-label">Nom</label>
          <input className="form-control mb-3" {...reg("username", { required: true })} />

          <label className="form-label">Email</label>
          <input className="form-control mb-3" type="email" {...reg("email", { required: true })} />

          <label className="form-label">Rôle</label>
          <select className="form-select mb-3" {...reg("role")}>
            <option value="USER">USER</option>
            <option value="ORGANIZER">ORGANIZER</option>
            <option value="ADMIN">ADMIN</option>
          </select>

          <label className="form-label">Mot de passe</label>
          <input className="form-control mb-3" type="password" {...reg("password", { required: true })} />

          <label className="form-label">Confirmer mot de passe</label>
          <input className="form-control mb-4" type="password" {...reg("confirmPassword", { required: true })} />

          <button className="btn btn-dark w-100" type="submit">Créer le compte</button>
        </form>

        <p className="mt-3 small">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
  );
}

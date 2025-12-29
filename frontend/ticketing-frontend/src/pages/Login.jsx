import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { getErrorMessage } from "../utils/errorMessage";

export default function Login() {
    const { register, handleSubmit } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const onSubmit = async (values) => {
        setError("");
        try {
            await login(values.email, values.password);
            navigate("/events");
        } catch (e) {
            setError(getErrorMessage(e, "Échec de connexion"));
        }
    };

    return (
        <div className="container py-5" style={{ maxWidth: 520 }}>
            <h2 className="fw-bold mb-3">Connexion</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className="card card-body shadow-sm">
                <label className="form-label">Email</label>
                <input className="form-control mb-3" type="email" {...register("email", { required: true })} />

                <label className="form-label">Mot de passe</label>
                <input className="form-control mb-4" type="password" {...register("password", { required: true })} />

                <button className="btn btn-dark w-100" type="submit">Se connecter</button>
            </form>

            <p className="mt-3 small">
                Pas de compte ? <Link to="/register">Créer un compte</Link>
            </p>
        </div>
    );
}

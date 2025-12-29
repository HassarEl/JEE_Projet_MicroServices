import React from "react";
import { Link } from "react-router-dom";

export default function Forbidden() {
  return (
    <div className="container py-5" style={{ maxWidth: 720 }}>
      <div className="alert alert-danger">
        <h4 className="fw-bold mb-1">Accès interdit</h4>
        <div>Vous n’avez pas les droits pour accéder à cette page.</div>
      </div>
      <Link to="/" className="btn btn-dark">Retour</Link>
    </div>
  );
}

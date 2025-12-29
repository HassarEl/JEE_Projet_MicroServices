import React from "react";

export default function Toast({ type = "info", message, onClose }) {
  if (!message) return null;
  const cls = type === "error" ? "alert-danger" : type === "success" ? "alert-success" : "alert-info";
  return (
    <div className={`alert ${cls} alert-dismissible`} role="alert">
      {message}
      <button type="button" className="btn-close" onClick={onClose} />
    </div>
  );
}

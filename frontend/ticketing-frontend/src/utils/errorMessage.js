/**
 * Extrait un message d’erreur lisible depuis une erreur Axios
 * @param {any} e - erreur Axios
 * @param {string} fallback - message par défaut
 * @returns {string}
 */
export function getErrorMessage(err, fallback = "Une erreur est survenue") {
    // Axios error
    if (err?.response) {
        const data = err.response.data;

        // Spring Boot / custom
        if (typeof data === "string") return data;
        if (data?.message) return data.message;
        if (data?.error) return data.error;

        try {
            return JSON.stringify(data);
        } catch {
            return fallback;
        }
    }

    // Network error
    if (err?.message) return err.message;

    return fallback;
}


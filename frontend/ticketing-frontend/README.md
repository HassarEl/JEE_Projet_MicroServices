# Ticketing Frontend (React)

## Prérequis
- Node.js 18+

## Démarrage
```bash
npm install
npm run dev
```

## Config
Par défaut le front appelle le Gateway sur `http://localhost:8080`.

Vous pouvez changer via `.env`:
```
VITE_API_BASE_URL=http://localhost:8080
```

## Parcours
- Inscription: `/register`
- Connexion: `/login`
- Liste événements: `/events`
- Détails + réservation: `/events/:id`
- Mes réservations: `/me/reservations`
- Paiement: `/payment/:reservationId`
- Admin: `/admin` (role = ADMIN)

> Les routes backend passent par le Gateway avec préfixe:
> `/event-service`, `/reservation-service`, `/payment-service`, `/notification-service`, `/user-service`.

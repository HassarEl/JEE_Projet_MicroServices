import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import MyReservations from "./pages/MyReservations";
import Payment from "./pages/Payment";
import Forbidden from "./pages/Forbidden";
import ProtectedRoute from "./auth/ProtectedRoute";


import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminReservations from "./pages/admin/AdminReservations";

import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";
import OrganizerCreateEvent from "./pages/organizer/OrganizerCreateEvent";

import MyNotifications from "./pages/MyNotifications";

export default function App() {
  return (
      <>
        <Navbar />

        <Routes>
          <Route path="/" element={<Navigate to="/events" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />

          {/* USER only */}
          <Route element={<ProtectedRoute roles={["USER"]} />}>
            <Route path="/me/reservations" element={<MyReservations />} />
            <Route path="/payment/:reservationId" element={<Payment />} />
          </Route>

          {/* ORGANIZER only */}
          <Route element={<ProtectedRoute roles={["ORGANIZER"]} />}>
            <Route path="/organizer" element={<OrganizerDashboard />} />
            <Route path="/organizer/events/new" element={<OrganizerCreateEvent />} /> {/* ✅ */}
          </Route>

          {/* ADMIN */}
          <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminDashboard />}>
              <Route index element={<Navigate to="events" replace />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="reservations" element={<AdminReservations />} />
            </Route>
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/me/reservations" element={<MyReservations />} />
            <Route path="/me/notifications" element={<MyNotifications />} />
            <Route path="/payment/:reservationId" element={<Payment />} />
          </Route>


          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="*" element={<Navigate to="/events" replace />} />
        </Routes>
      </>
  );
}

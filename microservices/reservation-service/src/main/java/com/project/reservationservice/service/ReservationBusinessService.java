package com.project.reservationservice.service;

import com.project.reservationservice.dtos.ReservationRequest;
import com.project.reservationservice.dtos.ReservationResponse;
import com.project.reservationservice.entities.Reservation;
import com.project.reservationservice.feign.EventRestClient;
import com.project.reservationservice.feign.UserRestClient;
import com.project.reservationservice.models.AppUser;
import com.project.reservationservice.models.Event;
import com.project.reservationservice.repositories.ReservationRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ReservationBusinessService {

    private final ReservationRepository reservationRepository;
    private final EventRestClient eventRestClient;
    private final UserRestClient userRestClient;

    public ReservationBusinessService(ReservationRepository reservationRepository,
                                      EventRestClient eventRestClient,
                                      UserRestClient userRestClient) {
        this.reservationRepository = reservationRepository;
        this.eventRestClient = eventRestClient;
        this.userRestClient = userRestClient;
    }

    @Transactional
    @CircuitBreaker(name = "reservationCB", fallbackMethod = "createReservationFallback")
    public ReservationResponse createReservation(ReservationRequest reservationRequest) {

        // ✅ validations
        if (reservationRequest.getUserId() == null)
            throw new RuntimeException("userId is required");
        if (reservationRequest.getEventId() == null)
            throw new RuntimeException("eventId is required");

        if (reservationRequest.getTicketCount() == null || reservationRequest.getTicketCount() <= 0)
            throw new RuntimeException("ticketCount is required and must be > 0");

        if (reservationRequest.getTicketCount() > 4)
            throw new RuntimeException("Maximum 4 tickets per reservation allowed.");

        // ✅ 1) verify user
        AppUser user = userRestClient.findUserById(reservationRequest.getUserId());
        if (user == null)
            throw new RuntimeException("User not found with ID: " + reservationRequest.getUserId());

        // ✅ 2) verify event
        Event event = eventRestClient.getEventById(reservationRequest.getEventId());
        if (event == null)
            throw new RuntimeException("Event not found with ID: " + reservationRequest.getEventId());

        if (event.getTotalTickets() == null)
            throw new RuntimeException("Event totalTickets is null (check EventService mapping).");

        if (event.getTotalTickets() < reservationRequest.getTicketCount())
            throw new RuntimeException("Not enough tickets available. Remaining: " + event.getTotalTickets());

        // ✅ 3) decrement tickets on event-service
        eventRestClient.decrementTickets(reservationRequest.getEventId(), reservationRequest.getTicketCount());

        // ✅ 4) save reservation
        Reservation reservation = new Reservation();
        reservation.setUserId(reservationRequest.getUserId());
        reservation.setEventId(reservationRequest.getEventId());
        reservation.setTicketCount(reservationRequest.getTicketCount());
        reservation.setReservationDate(LocalDateTime.now());
        reservation.setStatus("RESERVED");

        Reservation saved = reservationRepository.save(reservation);
        return mapToResponse(saved);
    }

    /**
     * ✅ Fallback: on ENREGISTRE la réservation en base avec statut PENDING
     * pour qu'elle apparaisse dans "Mes réservations".
     */
    @Transactional
    public ReservationResponse createReservationFallback(ReservationRequest reservationRequest, Throwable ex) {

        Reservation reservation = new Reservation();
        reservation.setUserId(reservationRequest.getUserId());
        reservation.setEventId(reservationRequest.getEventId());
        reservation.setTicketCount(reservationRequest.getTicketCount());
        reservation.setReservationDate(LocalDateTime.now());
        reservation.setStatus("PENDING_SERVICE_UNAVAILABLE");

        Reservation saved = reservationRepository.save(reservation);
        return mapToResponse(saved);
    }

    private ReservationResponse mapToResponse(Reservation reservation) {
        ReservationResponse response = new ReservationResponse();
        response.setId(reservation.getId());
        response.setUserId(reservation.getUserId());
        response.setEventId(reservation.getEventId());
        response.setTicketCount(reservation.getTicketCount());
        response.setReservationDate(reservation.getReservationDate());
        response.setStatus(reservation.getStatus());
        return response;
    }
}

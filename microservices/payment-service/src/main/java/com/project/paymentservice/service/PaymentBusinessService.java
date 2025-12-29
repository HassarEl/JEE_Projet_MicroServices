package com.project.paymentservice.service;

import com.project.paymentservice.dtos.PaymentResponse;
import com.project.paymentservice.entities.Payment;
import com.project.paymentservice.feign.EventClient;
import com.project.paymentservice.feign.NotificationClient;
import com.project.paymentservice.feign.ReservationClient;
import com.project.paymentservice.models.Event;
import com.project.paymentservice.models.Reservation;
import com.project.paymentservice.repositories.PaymentRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class PaymentBusinessService {

    private final PaymentRepository paymentRepository;
    private final ReservationClient reservationClient;
    private final EventClient eventClient;
    private final NotificationClient notificationClient;

    private final Random random = new Random();

    public PaymentBusinessService(PaymentRepository paymentRepository,
                                  ReservationClient reservationClient,
                                  EventClient eventClient,
                                  NotificationClient notificationClient) {
        this.paymentRepository = paymentRepository;
        this.reservationClient = reservationClient;
        this.eventClient = eventClient;
        this.notificationClient = notificationClient;
    }

    @CircuitBreaker(name = "reservationServiceCB", fallbackMethod = "fallbackReservation")
    public Reservation getReservation(Long id) {
        return reservationClient.getReservation(id);
    }
    public Reservation fallbackReservation(Long id, Throwable ex) {
        throw new RuntimeException("Reservation-Service indisponible (circuit breaker).");
    }

    @CircuitBreaker(name = "eventServiceCB", fallbackMethod = "fallbackEvent")
    public Event getEvent(Long id) {
        return eventClient.getEvent(id);
    }
    public Event fallbackEvent(Long id, Throwable ex) {
        throw new RuntimeException("Event-Service indisponible (circuit breaker).");
    }

    public PaymentResponse pay(Long reservationId) {
        Reservation reservation = getReservation(reservationId);

        if (!"RESERVED".equalsIgnoreCase(reservation.getStatus())) {
            throw new RuntimeException("Paiement impossible: réservation status=" + reservation.getStatus());
        }

        Event event = getEvent(reservation.getEventId());
        double unitPrice = event.getPrice() == null ? 0.0 : event.getPrice();
        double total = unitPrice * reservation.getTicketCount();

        boolean success = random.nextInt(100) < 85; // 85% succès (simulation)

        Payment p = new Payment();
        p.setReservationId(reservation.getId());
        p.setUserId(reservation.getUserId());
        p.setEventId(reservation.getEventId());
        p.setTicketCount(reservation.getTicketCount());
        p.setUnitPrice(unitPrice);
        p.setTotalAmount(total);
        p.setCreatedAt(LocalDateTime.now());
        p.setStatus(success ? "SUCCESS" : "FAILED");

        Payment saved = paymentRepository.save(p);

        // Update reservation status
        reservationClient.updateStatus(reservationId, success ? "PAID" : "PAYMENT_FAILED");

        // Notify
        notificationClient.notifyPayment(reservation.getUserId(), reservationId, saved.getStatus());

        PaymentResponse resp = new PaymentResponse();
        resp.setId(saved.getId());
        resp.setReservationId(saved.getReservationId());
        resp.setTotalAmount(saved.getTotalAmount());
        resp.setStatus(saved.getStatus());
        resp.setCreatedAt(saved.getCreatedAt());
        return resp;
    }
}

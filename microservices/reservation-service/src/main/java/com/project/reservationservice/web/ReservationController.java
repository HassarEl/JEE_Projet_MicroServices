package com.project.reservationservice.web;

import com.project.reservationservice.dtos.ReservationRequest;
import com.project.reservationservice.dtos.ReservationResponse;
import com.project.reservationservice.entities.Reservation;
import com.project.reservationservice.repositories.ReservationRepository;
import com.project.reservationservice.service.ReservationBusinessService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final ReservationBusinessService reservationBusinessService;

    public ReservationController(ReservationRepository reservationRepository,
                                 ReservationBusinessService reservationBusinessService) {
        this.reservationRepository = reservationRepository;
        this.reservationBusinessService = reservationBusinessService;
    }

    @GetMapping
    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    @GetMapping("/{id}")
    public ReservationResponse getById(@PathVariable Long id) {
        Reservation r = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        return mapToResponse(r);
    }

    @PutMapping("/{id}/status")
    public void updateStatus(@PathVariable Long id, @RequestParam String status) {
        Reservation r = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        r.setStatus(status);
        reservationRepository.save(r);
    }

    @GetMapping("/user/{userId}")
    public List<ReservationResponse> getReservationsByUserId(@PathVariable Long userId) {
        return reservationRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    @PostMapping
    public ReservationResponse createReservation(@RequestBody ReservationRequest reservationRequest) {
        // ✅ toute la logique est dans le service + circuit breaker
        return reservationBusinessService.createReservation(reservationRequest);
    }
    @GetMapping("/countTicketsByEvent")
    public Long countTicketsByEvent(@RequestParam Long eventId) {
        return reservationRepository.sumTicketsByEvent(eventId);
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

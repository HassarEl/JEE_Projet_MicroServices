package com.project.paymentservice.feign;

import com.project.paymentservice.models.Reservation;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "RESERVATION-SERVICE")
public interface ReservationClient {

    @GetMapping("/api/reservations/{id}")
    Reservation getReservation(@PathVariable("id") Long id);

    @PutMapping("/api/reservations/{id}/status")
    void updateStatus(@PathVariable("id") Long id, @RequestParam("status") String status);
}

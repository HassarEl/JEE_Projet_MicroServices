package com.project.eventservice.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "RESERVATION-SERVICE")
public interface ReservationClient {
    @GetMapping("/api/reservations/countTicketsByEvent")
    Long countTicketsByEvent(@RequestParam("eventId") Long eventId);
}

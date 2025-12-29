package com.project.reservationservice.feign;

import com.project.reservationservice.models.Event;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "EVENT-SERVICE") // ✅ IMPORTANT (même nom Eureka)
public interface EventRestClient {

    @GetMapping("/api/events/{id}")
    Event getEventById(@PathVariable("id") Long id);

    @PutMapping("/api/events/{id}/decrement-tickets")
    void decrementTickets(@PathVariable("id") Long id, @RequestParam("count") Integer count);
}

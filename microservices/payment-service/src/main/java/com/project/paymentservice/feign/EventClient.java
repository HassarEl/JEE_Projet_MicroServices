package com.project.paymentservice.feign;

import com.project.paymentservice.models.Event;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "EVENT-SERVICE")
public interface EventClient {
    @GetMapping("/api/events/{id}")
    Event getEvent(@PathVariable("id") Long id);
}

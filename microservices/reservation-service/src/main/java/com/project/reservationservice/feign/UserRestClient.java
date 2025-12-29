package com.project.reservationservice.feign;

import com.project.reservationservice.models.AppUser;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "USER-SERVICE") // ✅ IMPORTANT (même nom Eureka)
public interface UserRestClient {

    @GetMapping("/api/users/{id}")
    AppUser findUserById(@PathVariable("id") Long id);
}

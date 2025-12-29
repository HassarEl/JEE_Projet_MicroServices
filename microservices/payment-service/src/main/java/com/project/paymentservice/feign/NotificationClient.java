package com.project.paymentservice.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "NOTIFICATION-SERVICE")
public interface NotificationClient {
    @PostMapping("/api/notifications/payment")
    void notifyPayment(@RequestParam("userId") Long userId,
                       @RequestParam("reservationId") Long reservationId,
                       @RequestParam("status") String status);
}

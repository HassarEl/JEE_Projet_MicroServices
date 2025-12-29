package com.project.notificationservice.web;

import com.project.notificationservice.entities.Notification;
import com.project.notificationservice.repositories.NotificationRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository repository;

    public NotificationController(NotificationRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/payment")
    public void payment(@RequestParam Long userId,
                        @RequestParam Long reservationId,
                        @RequestParam String status) {

        String msg = "Paiement " + status + " pour réservation #" + reservationId;

        // Simulation : on log + on persist
        System.out.println("[NOTIF] userId=" + userId + " => " + msg);

        Notification n = new Notification();
        n.setUserId(userId);
        n.setType("EMAIL");
        n.setTitle("Paiement réservation");
        n.setMessage(msg);
        n.setCreatedAt(LocalDateTime.now());
        repository.save(n);
    }

    @GetMapping("/user/{userId}")
    public List<Notification> byUser(@PathVariable Long userId) {
        return repository.findByUserId(userId);
    }
}

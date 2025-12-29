package com.project.reservationservice.entities;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data @AllArgsConstructor @NoArgsConstructor
public class Reservation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long eventId; // Linked to Event Service
    private Long userId; // Linked to User Service

    private Integer ticketCount;
    private LocalDateTime reservationDate;
    private String status; // CONFIRMED, CANCELLED, PENDING
}

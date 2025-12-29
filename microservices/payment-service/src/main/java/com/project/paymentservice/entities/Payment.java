package com.project.paymentservice.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Payment {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long reservationId;
    private Long userId;
    private Long eventId;

    private Integer ticketCount;
    private Double unitPrice;
    private Double totalAmount;

    private String status; // SUCCESS / FAILED
    private LocalDateTime createdAt;
}

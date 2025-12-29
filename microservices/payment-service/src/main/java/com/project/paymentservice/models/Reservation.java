package com.project.paymentservice.models;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Reservation {
    private Long id;
    private Long eventId;
    private Long userId;
    private Integer ticketCount;
    private LocalDateTime reservationDate;
    private String status;
}

package com.project.reservationservice.dtos;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReservationResponse {
    private Long id;
    private Long userId;
    private Long eventId;
    private Integer ticketCount;
    private LocalDateTime reservationDate;
    private String status;
}

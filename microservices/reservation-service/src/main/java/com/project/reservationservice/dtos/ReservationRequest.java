package com.project.reservationservice.dtos;

import lombok.Data;

@Data
public class ReservationRequest {
    private Long userId;
    private Long eventId;
    private Integer ticketCount;
}

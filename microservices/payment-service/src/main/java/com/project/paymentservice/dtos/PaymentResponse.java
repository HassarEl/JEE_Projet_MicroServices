package com.project.paymentservice.dtos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PaymentResponse {
    private Long id;
    private Long reservationId;
    private Double totalAmount;
    private String status;
    private LocalDateTime createdAt;
}

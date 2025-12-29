package com.project.paymentservice.models;

import lombok.Data;

@Data
public class Event {
    private Long id;
    private String name;
    private Double price;
    private Integer totalTickets;
}

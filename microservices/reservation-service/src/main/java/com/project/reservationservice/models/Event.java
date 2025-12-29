package com.project.reservationservice.models;

import lombok.Data;
import java.time.LocalDate;

@Data
public class Event {
    private Long id;
    private String name;
    private LocalDate date;
    private String location;
    private Integer totalTickets;
    private Double price;
}

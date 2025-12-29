package com.project.eventservice.dtos;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class EventRequest {
    private String name;
    private LocalDate date;
    private String location;

    private Long organizerId;     // ✅ IMPORTANT
    private String organizer;     // optionnel

    private Integer totalTickets;
    private Double price;
    private List<String> participants;
}

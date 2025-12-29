package com.project.eventservice.dtos;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class EventResponse {
    private Long id;
    private String name;
    private LocalDate date;
    private String location;

    private Long organizerId;     // ✅ IMPORTANT
    private String organizer;

    private List<String> participants;
    private Integer totalTickets;
    private Double price;
}

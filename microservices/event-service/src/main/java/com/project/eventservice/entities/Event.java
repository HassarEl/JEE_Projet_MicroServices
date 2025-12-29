package com.project.eventservice.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private LocalDate date;
    private String location;

    // ✅ ID du user ORGANIZER qui a créé l'événement
    @Column(nullable = false)
    private Long organizerId;

    private String organizer; // nom affiché (optionnel)

    @ElementCollection
    @CollectionTable(name = "event_participants", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "participant")
    private List<String> participants = new ArrayList<>();

    private Integer totalTickets;
    private Double price;
}

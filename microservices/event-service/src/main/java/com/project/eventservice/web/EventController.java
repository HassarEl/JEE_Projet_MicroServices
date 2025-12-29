package com.project.eventservice.web;

import com.project.eventservice.dtos.EventRequest;
import com.project.eventservice.dtos.EventResponse;
import com.project.eventservice.entities.Event;
import com.project.eventservice.repositories.EventRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventRepository eventRepository;

    public EventController(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @GetMapping
    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // ✅ Nouveau : events d’un organizer uniquement
    @GetMapping("/organizer/{organizerId}")
    public List<EventResponse> getByOrganizer(@PathVariable Long organizerId) {
        return eventRepository.findByOrganizerId(organizerId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public EventResponse getEventById(@PathVariable Long id) {
        Event event = eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
        return mapToResponse(event);
    }

    @PostMapping
    public EventResponse createEvent(@RequestBody EventRequest req) {
        if (req.getOrganizerId() == null) {
            throw new RuntimeException("organizerId is required");
        }

        Event event = new Event();
        event.setName(req.getName());
        event.setDate(req.getDate());
        event.setLocation(req.getLocation());
        event.setOrganizerId(req.getOrganizerId()); // ✅
        event.setOrganizer(req.getOrganizer());     // optionnel
        event.setTotalTickets(req.getTotalTickets());
        event.setPrice(req.getPrice());
        event.setParticipants(req.getParticipants());

        return mapToResponse(eventRepository.save(event));
    }

    @PutMapping("/{id}")
    public EventResponse updateEvent(@PathVariable Long id, @RequestBody EventRequest req) {
        Event event = eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));

        if (req.getName() != null) event.setName(req.getName());
        if (req.getDate() != null) event.setDate(req.getDate());
        if (req.getLocation() != null) event.setLocation(req.getLocation());
        if (req.getOrganizer() != null) event.setOrganizer(req.getOrganizer());
        if (req.getTotalTickets() != null) event.setTotalTickets(req.getTotalTickets());
        if (req.getPrice() != null) event.setPrice(req.getPrice());
        if (req.getParticipants() != null) event.setParticipants(req.getParticipants());

        // ⚠️ organizerId en général ne change pas (sinon ajoute contrôle)
        return mapToResponse(eventRepository.save(event));
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        if (!eventRepository.existsById(id)) throw new RuntimeException("Event not found");
        eventRepository.deleteById(id);
    }

    @PutMapping("/{id}/decrement-tickets")
    public void decrementTickets(@PathVariable Long id, @RequestParam Integer count) {
        Event event = eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
        if (count == null || count <= 0) throw new RuntimeException("Invalid ticket count");
        if (event.getTotalTickets() < count) throw new RuntimeException("Not enough tickets available");

        event.setTotalTickets(event.getTotalTickets() - count);
        eventRepository.save(event);
    }

    private EventResponse mapToResponse(Event event) {
        EventResponse r = new EventResponse();
        r.setId(event.getId());
        r.setName(event.getName());
        r.setDate(event.getDate());
        r.setLocation(event.getLocation());
        r.setOrganizerId(event.getOrganizerId()); // ✅
        r.setOrganizer(event.getOrganizer());
        r.setParticipants(event.getParticipants());
        r.setTotalTickets(event.getTotalTickets());
        r.setPrice(event.getPrice());
        return r;
    }
}

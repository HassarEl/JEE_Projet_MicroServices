package com.project.reservationservice.repositories;

import com.project.reservationservice.entities.Reservation;
import feign.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserId(Long userId);
    @Query("select coalesce(sum(r.ticketCount),0) from Reservation r where r.eventId = :eventId and r.status in ('RESERVED','PAID')")
    Long sumTicketsByEvent(@Param("eventId") Long eventId);

}

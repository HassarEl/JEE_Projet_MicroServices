package com.project.reservationservice.models;

import lombok.Data;

@Data
public class AppUser {
    private Long id;
    private String username;
    private String email;
    private String role;
}

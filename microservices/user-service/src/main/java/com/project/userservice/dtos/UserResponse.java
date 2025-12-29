package com.project.userservice.dtos;

import com.project.userservice.entities.Role;
import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private Role role;
}

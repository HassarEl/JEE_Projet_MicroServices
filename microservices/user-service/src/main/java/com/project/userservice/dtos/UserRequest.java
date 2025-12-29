package com.project.userservice.dtos;

import com.project.userservice.entities.Role;
import lombok.Data;

@Data
public class UserRequest {
    private String username;
    private String email;
    private String password;
    private Role role;
}

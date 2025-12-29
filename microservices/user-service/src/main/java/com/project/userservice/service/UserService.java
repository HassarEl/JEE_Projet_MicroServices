package com.project.userservice.service;

import com.project.userservice.dtos.RegisterRequest;
import com.project.userservice.entities.AppUser;
import com.project.userservice.entities.Role;
import com.project.userservice.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    public UserService(UserRepository userRepository, PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    public AppUser register(RegisterRequest req) {

        if (req.getUsername() == null || req.getUsername().isBlank())
            throw new IllegalArgumentException("username is required");
        if (req.getEmail() == null || req.getEmail().isBlank())
            throw new IllegalArgumentException("email is required");
        if (req.getPassword() == null || req.getPassword().isBlank())
            throw new IllegalArgumentException("password is required");

        if (userRepository.existsByUsername(req.getUsername()))
            throw new IllegalArgumentException("username already exists");
        if (userRepository.existsByEmail(req.getEmail()))
            throw new IllegalArgumentException("email already exists");

        Role role = Role.USER;
        if (req.getRole() != null && !req.getRole().isBlank()) {
            role = Role.valueOf(req.getRole().trim().toUpperCase());
        }

        AppUser u = new AppUser();
        u.setUsername(req.getUsername().trim());
        u.setEmail(req.getEmail().trim().toLowerCase());
        u.setPassword(encoder.encode(req.getPassword()));
        u.setRole(role);

        return userRepository.save(u);
    }
}

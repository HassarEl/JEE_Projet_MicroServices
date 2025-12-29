package com.project.userservice.web;

import com.project.userservice.dtos.UserResponse;
import com.project.userservice.entities.AppUser;
import com.project.userservice.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository repo;

    public UserController(UserRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<UserResponse> all() {
        return repo.findAll().stream().map(this::toDto).toList();
    }

    @GetMapping("/{id}")
    public UserResponse byId(@PathVariable Long id) {
        AppUser u = repo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        return toDto(u);
    }

    private UserResponse toDto(AppUser u) {
        UserResponse r = new UserResponse();
        r.setId(u.getId());
        r.setUsername(u.getUsername());
        r.setEmail(u.getEmail());
        r.setRole(u.getRole());
        return r;
    }
}

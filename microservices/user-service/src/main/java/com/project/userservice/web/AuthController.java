package com.project.userservice.web;

import com.project.userservice.dtos.*;
import com.project.userservice.entities.AppUser;
import com.project.userservice.service.JwtService;
import com.project.userservice.service.UserService;
import com.project.userservice.service.CustomUserDetails;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    public AuthController(JwtService jwtService, AuthenticationManager authenticationManager, UserService userService) {
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }

    @PostMapping("/register")
    public RegisterResponse register(@RequestBody RegisterRequest request) {
        AppUser created = userService.register(request);
        return new RegisterResponse(
                created.getId(),
                created.getUsername(),
                created.getEmail(),
                created.getRole().name()
        );
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest req) {

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        String role = userDetails.getAuthorities().iterator().next().getAuthority(); // ROLE_ADMIN...
        Long userId = userDetails.getId();

        String token = jwtService.generateToken(req.getEmail(), role, userId);
        return new AuthResponse(token, role, userId);
    }
}

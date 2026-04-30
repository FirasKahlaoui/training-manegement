package com.formationmanagement.training_management.controllers;

import com.formationmanagement.training_management.dto.LoginRequest;
import com.formationmanagement.training_management.dto.LoginResponse;
import com.formationmanagement.training_management.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired private AuthService authService;

    /**
     * POST /api/auth/login
     * Body: { "login": "admin", "password": "secret" }
     * Returns: { "token": "...", "login": "admin", "role": "administrateur", "userId": 1 }
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}

package com.clinica.api.controller;

import com.clinica.api.dto.request.LoginRequest;
import com.clinica.api.dto.request.UsuarioRequest;
import com.clinica.api.dto.response.AuthResponse;
import com.clinica.api.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/registrar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AuthResponse> registrar(@Valid @RequestBody UsuarioRequest request) {
        return ResponseEntity.ok(authService.registrar(request));
    }
}

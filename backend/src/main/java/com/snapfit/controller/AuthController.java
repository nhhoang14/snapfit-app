package com.snapfit.controller;

import com.snapfit.dto.AuthResponse;
import com.snapfit.dto.LoginRequest;
import com.snapfit.dto.RegisterRequest;
import com.snapfit.common.ApiResponse;
import com.snapfit.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> register(@RequestBody RegisterRequest request) {
        AuthResponse resp = authService.register(request);
        if (resp.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success(resp.getMessage(), null));
        }
        return ResponseEntity.badRequest().body(ApiResponse.error(resp.getMessage()));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> login(@RequestBody LoginRequest request) {
        AuthResponse resp = authService.login(request);
        if (resp.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success("Login successful", resp.getToken()));
        }
        return ResponseEntity.status(401).body(ApiResponse.error(resp.getMessage()));
    }
}

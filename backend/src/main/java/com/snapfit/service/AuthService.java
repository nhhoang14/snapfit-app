package com.snapfit.service;

import com.snapfit.dto.LoginRequest;
import com.snapfit.dto.RegisterRequest;
import com.snapfit.dto.AuthResponse;
import com.snapfit.entity.User;
import com.snapfit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {
        // Validate uniqueness
        if (userRepository.existsByUsername(request.getUsername())) {
            return AuthResponse.error("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return AuthResponse.error("Email already registered");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        // In a real app, generate JWT token here
        return AuthResponse.success("User registered successfully", null);
    }

    public AuthResponse login(LoginRequest request) {
        Optional<User> optionalUser = userRepository.findByUsername(request.getUsername());
        if (optionalUser.isEmpty()) {
            return AuthResponse.error("Invalid username or password");
        }
        User user = optionalUser.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return AuthResponse.error("Invalid username or password");
        }
        // Placeholder token; replace with real JWT generation
        String token = "dummy-token-for-" + user.getUsername();
        return AuthResponse.success(token);
    }
}

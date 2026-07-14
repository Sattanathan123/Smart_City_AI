package com.smartcity.service;

import com.smartcity.dto.AuthResponse;
import com.smartcity.dto.LoginRequest;
import com.smartcity.dto.RegisterRequest;
import com.smartcity.entity.User;
import com.smartcity.exception.BadRequestException;
import com.smartcity.exception.ResourceNotFoundException;
import com.smartcity.repository.UserRepository;
import com.smartcity.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("Email already registered: " + req.getEmail());
        }
        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setDepartment(req.getDepartment());
        user.setPhone(req.getPhone());
        user.setRole(req.getRole());
        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved, saved.getRole().name());
        return new AuthResponse(saved.getId(), saved.getName(), saved.getEmail(),
                saved.getPhone(), saved.getDepartment(), saved.getRole().name(), token, "Registration successful");
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + req.getEmail()));
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid credentials");
        }
        String token = jwtUtil.generateToken(user, user.getRole().name());
        return new AuthResponse(user.getId(), user.getName(), user.getEmail(),
                user.getPhone(), user.getDepartment(), user.getRole().name(), token, "Login successful");
    }
}

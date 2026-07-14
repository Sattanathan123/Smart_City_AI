package com.smartcity.controller;

import com.smartcity.dto.DashboardResponse;
import com.smartcity.dto.RegisterRequest;
import com.smartcity.dto.UserResponse;
import com.smartcity.entity.Role;
import com.smartcity.entity.User;
import com.smartcity.exception.BadRequestException;
import com.smartcity.exception.ResourceNotFoundException;
import com.smartcity.repository.UserRepository;
import com.smartcity.service.AuthService;
import com.smartcity.service.DashboardService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final DashboardService dashboardService;
    private final AuthService authService;
    private final PasswordEncoder passwordEncoder;

    public AdminController(UserRepository userRepository, DashboardService dashboardService,
                           AuthService authService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.dashboardService = dashboardService;
        this.authService = authService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard() {
        return ResponseEntity.ok(dashboardService.getDashboard());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(
                userRepository.findAll().stream().map(UserResponse::from).toList()
        );
    }

    @GetMapping("/users/officers")
    public ResponseEntity<List<UserResponse>> getOfficers() {
        return ResponseEntity.ok(
                userRepository.findByRole(Role.DEPARTMENT_OFFICER).stream().map(UserResponse::from).toList()
        );
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(req));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        if (body.containsKey("name")) user.setName(body.get("name"));
        if (body.containsKey("department")) user.setDepartment(body.get("department"));
        if (body.containsKey("password") && !body.get("password").isBlank()) {
            user.setPassword(passwordEncoder.encode(body.get("password")));
        }
        if (body.containsKey("role")) {
            try { user.setRole(Role.valueOf(body.get("role"))); }
            catch (IllegalArgumentException e) { throw new BadRequestException("Invalid role: " + body.get("role")); }
        }
        return ResponseEntity.ok(UserResponse.from(userRepository.save(user)));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

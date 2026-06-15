package com.hotelbooking.user.controller;

import com.hotelbooking.user.dto.UserRequest;
import com.hotelbooking.user.dto.UserResponse;
import com.hotelbooking.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User management endpoints")
public class UserController {

    private final UserService userService;

    @Value("${server.port:8081}")
    private String serverPort;

    // ── GET all ────────────────────────────────────────────────────────────

    @GetMapping
    @Operation(summary = "List all users")
    public ResponseEntity<List<UserResponse>> findAll() {
        return ResponseEntity.ok(userService.findAll());
    }

    // ── GET by id ──────────────────────────────────────────────────────────

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    public ResponseEntity<UserResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    // ── GET by email ───────────────────────────────────────────────────────

    @GetMapping("/email/{email}")
    @Operation(summary = "Get user by email")
    public ResponseEntity<UserResponse> findByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.findByEmail(email));
    }

    /*
     * Endpoint de validación expuesto para que ms-booking-service
     * lo consuma vía OpenFeign sin necesitar los datos completos del usuario.
     * Retorna {"exists": true/false}.
     */
    @GetMapping("/{id}/exists")
    @Operation(summary = "Validate user existence by ID — consumed by ms-booking-service via Feign")
    public ResponseEntity<Map<String, Boolean>> existsById(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("exists", userService.existsById(id)));
    }

    // ── POST create ────────────────────────────────────────────────────────

    @PostMapping
    @Operation(summary = "Create a new user")
    public ResponseEntity<UserResponse> create(@Valid @RequestBody UserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.create(request));
    }

    // ── PUT update ─────────────────────────────────────────────────────────

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing user")
    public ResponseEntity<UserResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(userService.update(id, request));
    }

    // ── DELETE ─────────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a user by ID")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ── GET instancia ──────────────────────────────────────────────────────

    @GetMapping("/instancia")
    @Operation(summary = "Show service instance info (port + host)")
    public ResponseEntity<Map<String, String>> instancia() {
        return ResponseEntity.ok(Map.of(
                "service", "ms-user-service",
                "port", serverPort,
                "host", System.getenv().getOrDefault("HOSTNAME", "localhost")
        ));
    }
}

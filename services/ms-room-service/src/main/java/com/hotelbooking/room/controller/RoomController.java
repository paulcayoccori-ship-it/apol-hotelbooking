package com.hotelbooking.room.controller;

import com.hotelbooking.room.dto.RoomRequest;
import com.hotelbooking.room.dto.RoomResponse;
import com.hotelbooking.room.service.RoomService;
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
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
@Tag(name = "Rooms", description = "Room management endpoints")
public class RoomController {

    private final RoomService roomService;

    @Value("${server.port:8082}")
    private String serverPort;

    // ── GET all ────────────────────────────────────────────────────────────

    @GetMapping
    @Operation(summary = "List all rooms")
    public ResponseEntity<List<RoomResponse>> findAll() {
        return ResponseEntity.ok(roomService.findAll());
    }

    // ── GET by id ──────────────────────────────────────────────────────────

    @GetMapping("/{id}")
    @Operation(summary = "Get room by ID")
    public ResponseEntity<RoomResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.findById(id));
    }

    // ── GET available ──────────────────────────────────────────────────────

    @GetMapping("/available")
    @Operation(summary = "List rooms with status AVAILABLE")
    public ResponseEntity<List<RoomResponse>> findAvailable() {
        return ResponseEntity.ok(roomService.findAvailable());
    }

    // ── POST create ────────────────────────────────────────────────────────

    @PostMapping
    @Operation(summary = "Create a new room")
    public ResponseEntity<RoomResponse> create(@Valid @RequestBody RoomRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(roomService.create(request));
    }

    // ── PUT update ─────────────────────────────────────────────────────────

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing room")
    public ResponseEntity<RoomResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomService.update(id, request));
    }

    // ── DELETE ─────────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a room by ID")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        roomService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ── GET instancia ──────────────────────────────────────────────────────

    @GetMapping("/instancia")
    @Operation(summary = "Show service instance info (port + host)")
    public ResponseEntity<Map<String, String>> instancia() {
        return ResponseEntity.ok(Map.of(
                "service", "ms-room-service",
                "port", serverPort,
                "host", System.getenv().getOrDefault("HOSTNAME", "localhost")
        ));
    }
}

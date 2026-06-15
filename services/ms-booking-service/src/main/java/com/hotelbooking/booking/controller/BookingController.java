package com.hotelbooking.booking.controller;

import com.hotelbooking.booking.dto.BookingRequest;
import com.hotelbooking.booking.dto.BookingResponse;
import com.hotelbooking.booking.service.BookingService;
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
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Booking management endpoints")
public class BookingController {

    private final BookingService bookingService;

    @Value("${server.port:8083}")
    private String serverPort;

    // ── GET all ────────────────────────────────────────────────────────────

    @GetMapping
    @Operation(summary = "List all bookings")
    public ResponseEntity<List<BookingResponse>> findAll() {
        return ResponseEntity.ok(bookingService.findAll());
    }

    // ── GET by id ──────────────────────────────────────────────────────────

    @GetMapping("/{id}")
    @Operation(summary = "Get booking by ID")
    public ResponseEntity<BookingResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.findById(id));
    }

    // ── GET by userId ──────────────────────────────────────────────────────

    @GetMapping("/user/{userId}")
    @Operation(summary = "List bookings by user ID")
    public ResponseEntity<List<BookingResponse>> findByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.findByUserId(userId));
    }

    // ── POST create ────────────────────────────────────────────────────────

    @PostMapping
    @Operation(summary = "Create a new booking (status: PENDING)")
    public ResponseEntity<BookingResponse> create(@Valid @RequestBody BookingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.create(request));
    }

    // ── PUT update ─────────────────────────────────────────────────────────

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing booking")
    public ResponseEntity<BookingResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.update(id, request));
    }

    // ── PATCH confirm ──────────────────────────────────────────────────────

    @PatchMapping("/{id}/confirm")
    @Operation(summary = "Confirm a PENDING booking → status becomes CONFIRMED")
    public ResponseEntity<BookingResponse> confirm(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.confirm(id));
    }

    // ── PATCH cancel ───────────────────────────────────────────────────────

    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Cancel a PENDING or CONFIRMED booking → status becomes CANCELLED")
    public ResponseEntity<BookingResponse> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancel(id));
    }

    // ── DELETE ─────────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a booking by ID")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookingService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ── GET instancia ──────────────────────────────────────────────────────

    @GetMapping("/instancia")
    @Operation(summary = "Show service instance info (port + host)")
    public ResponseEntity<Map<String, String>> instancia() {
        return ResponseEntity.ok(Map.of(
                "service", "ms-booking-service",
                "port", serverPort,
                "host", System.getenv().getOrDefault("HOSTNAME", "localhost")
        ));
    }
}

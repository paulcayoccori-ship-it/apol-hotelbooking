package com.hotelbooking.payment.controller;

import com.hotelbooking.payment.dto.PaymentRequest;
import com.hotelbooking.payment.dto.PaymentResponse;
import com.hotelbooking.payment.service.PaymentService;
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
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Payment management endpoints")
public class PaymentController {

    private final PaymentService paymentService;

    @Value("${server.port:8084}")
    private String serverPort;

    // ── GET all ────────────────────────────────────────────────────────────

    @GetMapping
    @Operation(summary = "List all payments")
    public ResponseEntity<List<PaymentResponse>> findAll() {
        return ResponseEntity.ok(paymentService.findAll());
    }

    // ── GET by id ──────────────────────────────────────────────────────────

    @GetMapping("/{id}")
    @Operation(summary = "Get payment by ID")
    public ResponseEntity<PaymentResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.findById(id));
    }

    // ── GET by bookingId ───────────────────────────────────────────────────

    @GetMapping("/booking/{bookingId}")
    @Operation(summary = "List payments associated to a booking ID")
    public ResponseEntity<List<PaymentResponse>> findByBookingId(@PathVariable Long bookingId) {
        return ResponseEntity.ok(paymentService.findByBookingId(bookingId));
    }

    // ── POST create ────────────────────────────────────────────────────────

    @PostMapping
    @Operation(summary = "Register a new payment (status: PENDING)")
    public ResponseEntity<PaymentResponse> create(@Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentService.create(request));
    }

    // ── PATCH confirm ──────────────────────────────────────────────────────

    @PatchMapping("/{id}/confirm")
    @Operation(summary = "Confirm a PENDING payment → status becomes PAID, paidAt is set")
    public ResponseEntity<PaymentResponse> confirm(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.confirm(id));
    }

    // ── PATCH fail ─────────────────────────────────────────────────────────

    @PatchMapping("/{id}/fail")
    @Operation(summary = "Mark a PENDING payment as FAILED")
    public ResponseEntity<PaymentResponse> fail(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.fail(id));
    }

    // ── GET instancia ──────────────────────────────────────────────────────

    @GetMapping("/instancia")
    @Operation(summary = "Show service instance info (port + host)")
    public ResponseEntity<Map<String, String>> instancia() {
        return ResponseEntity.ok(Map.of(
                "service", "ms-payment-service",
                "port", serverPort,
                "host", System.getenv().getOrDefault("HOSTNAME", "localhost")
        ));
    }
}

package com.hotelbooking.notification.controller;

import com.hotelbooking.notification.dto.NotificationRequest;
import com.hotelbooking.notification.dto.NotificationResponse;
import com.hotelbooking.notification.service.NotificationService;
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
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Notification management — simulated send")
public class NotificationController {

    private final NotificationService notificationService;

    @Value("${server.port:8085}")
    private String port;

    // GET /api/v1/notifications
    @GetMapping
    @Operation(summary = "List all notifications")
    public ResponseEntity<List<NotificationResponse>> findAll() {
        return ResponseEntity.ok(notificationService.findAll());
    }

    // GET /api/v1/notifications/{id}
    @GetMapping("/{id}")
    @Operation(summary = "Get notification by ID")
    public ResponseEntity<NotificationResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.findById(id));
    }

    // POST /api/v1/notifications
    @PostMapping
    @Operation(summary = "Create a new notification (status = PENDING)")
    public ResponseEntity<NotificationResponse> create(@Valid @RequestBody NotificationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(notificationService.create(request));
    }

    // PATCH /api/v1/notifications/{id}/send
    @PatchMapping("/{id}/send")
    @Operation(summary = "Simulate sending a notification (PENDING/FAILED → SENT)")
    public ResponseEntity<NotificationResponse> send(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.send(id));
    }

    // GET /api/v1/notifications/user/{userId}
    @GetMapping("/user/{userId}")
    @Operation(summary = "List notifications by user ID")
    public ResponseEntity<List<NotificationResponse>> findByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.findByUserId(userId));
    }

    // GET /api/v1/notifications/booking/{bookingId}
    @GetMapping("/booking/{bookingId}")
    @Operation(summary = "List notifications by booking ID")
    public ResponseEntity<List<NotificationResponse>> findByBookingId(@PathVariable Long bookingId) {
        return ResponseEntity.ok(notificationService.findByBookingId(bookingId));
    }

    // GET /api/v1/notifications/instancia
    @GetMapping("/instancia")
    @Operation(summary = "Instance info — port used for load-balancing verification")
    public ResponseEntity<Map<String, String>> instancia() {
        return ResponseEntity.ok(Map.of(
                "service", "ms-notification-service",
                "port", port
        ));
    }
}

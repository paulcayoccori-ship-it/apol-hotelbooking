package com.hotelbooking.notification.dto;

import com.hotelbooking.notification.enums.NotificationChannel;
import com.hotelbooking.notification.enums.NotificationStatus;
import com.hotelbooking.notification.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

    private Long id;
    private Long userId;
    private Long bookingId;
    private NotificationType type;
    private NotificationChannel channel;
    private String subject;
    private String message;
    private NotificationStatus status;
    private LocalDateTime sentAt;
}

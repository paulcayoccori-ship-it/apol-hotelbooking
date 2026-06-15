package com.hotelbooking.notification.repository;

import com.hotelbooking.notification.entity.Notification;
import com.hotelbooking.notification.enums.NotificationStatus;
import com.hotelbooking.notification.enums.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserId(Long userId);

    List<Notification> findByBookingId(Long bookingId);

    List<Notification> findByStatus(NotificationStatus status);

    List<Notification> findByUserIdAndType(Long userId, NotificationType type);
}

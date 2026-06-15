package com.hotelbooking.notification.service;

import com.hotelbooking.notification.dto.NotificationRequest;
import com.hotelbooking.notification.dto.NotificationResponse;

import java.util.List;

public interface NotificationService {

    List<NotificationResponse> findAll();

    NotificationResponse findById(Long id);

    NotificationResponse create(NotificationRequest request);

    NotificationResponse send(Long id);

    List<NotificationResponse> findByUserId(Long userId);

    List<NotificationResponse> findByBookingId(Long bookingId);
}

package com.hotelbooking.notification.service.impl;

import com.hotelbooking.notification.dto.NotificationRequest;
import com.hotelbooking.notification.dto.NotificationResponse;
import com.hotelbooking.notification.entity.Notification;
import com.hotelbooking.notification.enums.NotificationStatus;
import com.hotelbooking.notification.exception.InvalidNotificationStateException;
import com.hotelbooking.notification.exception.NotificationNotFoundException;
import com.hotelbooking.notification.repository.NotificationRepository;
import com.hotelbooking.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    /*
     * TODO fase Kafka — agregar aquí:
     *   @KafkaListener(topics = "booking-events")
     *   public void onBookingEvent(BookingEvent event) { create(buildRequest(event)); }
     *
     *   @KafkaListener(topics = "payment-events")
     *   public void onPaymentEvent(PaymentEvent event) { create(buildRequest(event)); }
     *
     * TODO fase Feign — para enriquecer notificaciones con datos del usuario:
     *   private final UserClient userClient;   → obtener email/teléfono real del usuario
     *
     * TODO fase Mail/SMS — reemplazar simulación en send() con:
     *   EMAIL   → JavaMailSender
     *   SMS     → Twilio / AWS SNS
     *   WHATSAPP → WhatsApp Business API
     */

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> findAll() {
        return notificationRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationResponse findById(Long id) {
        return toResponse(getOrThrow(id));
    }

    @Override
    @Transactional
    public NotificationResponse create(NotificationRequest request) {
        Notification notification = Notification.builder()
                .userId(request.getUserId())
                .bookingId(request.getBookingId())
                .type(request.getType())
                .channel(request.getChannel())
                .subject(request.getSubject())
                .message(request.getMessage())
                .status(NotificationStatus.PENDING)
                .sentAt(null)
                .build();

        Notification saved = notificationRepository.save(notification);
        log.info("[NOTIFICATION CREATED] id={} type={} channel={} userId={}",
                saved.getId(), saved.getType(), saved.getChannel(), saved.getUserId());

        return toResponse(saved);
    }

    @Override
    @Transactional
    public NotificationResponse send(Long id) {
        Notification notification = getOrThrow(id);

        if (notification.getStatus() == NotificationStatus.SENT) {
            throw new InvalidNotificationStateException(
                    "Notification with id " + id + " is already SENT"
            );
        }

        /*
         * Simulación de envío — sin llamadas reales a email/SMS/WhatsApp.
         * Cuando se agreguen los canales reales, reemplazar este bloque.
         */
        log.info("[NOTIFICATION SENT - SIMULATED] id={} type={} channel={} to userId={} — subject: '{}'",
                notification.getId(),
                notification.getType(),
                notification.getChannel(),
                notification.getUserId(),
                notification.getSubject());

        notification.setStatus(NotificationStatus.SENT);
        notification.setSentAt(LocalDateTime.now());

        return toResponse(notificationRepository.save(notification));
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> findByUserId(Long userId) {
        return notificationRepository.findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> findByBookingId(Long bookingId) {
        return notificationRepository.findByBookingId(bookingId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    private Notification getOrThrow(Long id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new NotificationNotFoundException(id));
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .userId(n.getUserId())
                .bookingId(n.getBookingId())
                .type(n.getType())
                .channel(n.getChannel())
                .subject(n.getSubject())
                .message(n.getMessage())
                .status(n.getStatus())
                .sentAt(n.getSentAt())
                .build();
    }
}

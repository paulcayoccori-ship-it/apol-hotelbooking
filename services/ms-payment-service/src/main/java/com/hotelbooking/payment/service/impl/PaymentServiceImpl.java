package com.hotelbooking.payment.service.impl;

import com.hotelbooking.payment.dto.PaymentRequest;
import com.hotelbooking.payment.dto.PaymentResponse;
import com.hotelbooking.payment.entity.Payment;
import com.hotelbooking.payment.enums.PaymentStatus;
import com.hotelbooking.payment.exception.InvalidPaymentException;
import com.hotelbooking.payment.exception.PaymentNotFoundException;
import com.hotelbooking.payment.repository.PaymentRepository;
import com.hotelbooking.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    /*
     * TODO fase Feign — inyectar aquí:
     *   private final BookingClient bookingClient;
     *   → validar que la reserva exista y esté en estado CONFIRMED antes de procesar el pago
     *
     * TODO fase Kafka — publicar evento aquí:
     *   → PaymentConfirmedEvent al confirmar un pago (notificación al ms-notification-service)
     *   → PaymentFailedEvent al fallar (para que booking revierta el estado)
     */

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> findAll() {
        return paymentRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse findById(Long id) {
        return toResponse(getOrThrow(id));
    }

    @Override
    @Transactional
    public PaymentResponse create(PaymentRequest request) {
        /*
         * TODO fase Feign:
         *   BookingResponse booking = bookingClient.findById(request.getBookingId());
         *   if (booking.getStatus() != BookingStatus.CONFIRMED) {
         *       throw new InvalidPaymentException("Booking must be CONFIRMED before payment");
         *   }
         */

        String txCode = resolveTransactionCode(request.getTransactionCode());

        Payment payment = Payment.builder()
                .bookingId(request.getBookingId())
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .status(PaymentStatus.PENDING)
                .transactionCode(txCode)
                .paidAt(null)
                .build();

        return toResponse(paymentRepository.save(payment));
    }

    @Override
    @Transactional
    public PaymentResponse confirm(Long id) {
        Payment payment = getOrThrow(id);

        switch (payment.getStatus()) {
            case PAID     -> throw new InvalidPaymentException("Payment is already PAID");
            case FAILED   -> throw new InvalidPaymentException("Cannot confirm a FAILED payment");
            case REFUNDED -> throw new InvalidPaymentException("Cannot confirm a REFUNDED payment");
            default       -> { /* PENDING → continúa */ }
        }

        payment.setStatus(PaymentStatus.PAID);
        payment.setPaidAt(LocalDateTime.now());

        return toResponse(paymentRepository.save(payment));
    }

    @Override
    @Transactional
    public PaymentResponse fail(Long id) {
        Payment payment = getOrThrow(id);

        switch (payment.getStatus()) {
            case PAID     -> throw new InvalidPaymentException("Cannot fail an already PAID payment");
            case FAILED   -> throw new InvalidPaymentException("Payment is already FAILED");
            case REFUNDED -> throw new InvalidPaymentException("Cannot fail a REFUNDED payment");
            default       -> { /* PENDING → continúa */ }
        }

        payment.setStatus(PaymentStatus.FAILED);

        return toResponse(paymentRepository.save(payment));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> findByBookingId(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    private Payment getOrThrow(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new PaymentNotFoundException(id));
    }

    private String resolveTransactionCode(String provided) {
        if (provided != null && !provided.isBlank()) {
            return provided;
        }
        return "TXN-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }

    private PaymentResponse toResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .bookingId(payment.getBookingId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())
                .transactionCode(payment.getTransactionCode())
                .paidAt(payment.getPaidAt())
                .build();
    }
}

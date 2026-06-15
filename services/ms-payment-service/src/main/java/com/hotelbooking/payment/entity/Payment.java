package com.hotelbooking.payment.entity;

import com.hotelbooking.payment.enums.PaymentMethod;
import com.hotelbooking.payment.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_id", nullable = false)
    private Long bookingId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 20)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentStatus status;

    // Generado automáticamente en el servicio si no se provee
    @Column(name = "transaction_code", unique = true, length = 50)
    private String transactionCode;

    // NULL mientras el pago está PENDING; se asigna al confirmar
    @Column(name = "paid_at")
    private LocalDateTime paidAt;
}

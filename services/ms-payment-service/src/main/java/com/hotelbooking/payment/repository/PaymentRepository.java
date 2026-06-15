package com.hotelbooking.payment.repository;

import com.hotelbooking.payment.entity.Payment;
import com.hotelbooking.payment.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByBookingId(Long bookingId);

    List<Payment> findByStatus(PaymentStatus status);

    Optional<Payment> findByTransactionCode(String transactionCode);
}

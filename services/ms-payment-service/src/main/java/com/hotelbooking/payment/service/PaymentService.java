package com.hotelbooking.payment.service;

import com.hotelbooking.payment.dto.PaymentRequest;
import com.hotelbooking.payment.dto.PaymentResponse;

import java.util.List;

public interface PaymentService {

    List<PaymentResponse> findAll();

    PaymentResponse findById(Long id);

    PaymentResponse create(PaymentRequest request);

    PaymentResponse confirm(Long id);

    PaymentResponse fail(Long id);

    List<PaymentResponse> findByBookingId(Long bookingId);
}

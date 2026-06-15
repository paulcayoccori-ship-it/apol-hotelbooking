package com.hotelbooking.booking.service;

import com.hotelbooking.booking.dto.BookingRequest;
import com.hotelbooking.booking.dto.BookingResponse;

import java.util.List;

public interface BookingService {

    List<BookingResponse> findAll();

    BookingResponse findById(Long id);

    BookingResponse create(BookingRequest request);

    BookingResponse update(Long id, BookingRequest request);

    BookingResponse confirm(Long id);

    BookingResponse cancel(Long id);

    void delete(Long id);

    List<BookingResponse> findByUserId(Long userId);
}

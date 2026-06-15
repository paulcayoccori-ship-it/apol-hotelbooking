package com.hotelbooking.room.service;

import com.hotelbooking.room.dto.RoomRequest;
import com.hotelbooking.room.dto.RoomResponse;

import java.util.List;

public interface RoomService {

    List<RoomResponse> findAll();

    RoomResponse findById(Long id);

    RoomResponse create(RoomRequest request);

    RoomResponse update(Long id, RoomRequest request);

    void delete(Long id);

    List<RoomResponse> findAvailable();
}

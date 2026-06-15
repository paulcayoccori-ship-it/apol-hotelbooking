package com.hotelbooking.room.repository;

import com.hotelbooking.room.entity.Room;
import com.hotelbooking.room.enums.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByStatus(RoomStatus status);
}

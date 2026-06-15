package com.hotelbooking.room.dto;

import com.hotelbooking.room.enums.RoomStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponse {

    private Long id;
    private String roomNumber;
    private String type;
    private String description;
    private BigDecimal pricePerNight;
    private Integer capacity;
    private RoomStatus status;
}

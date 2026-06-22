package com.hotelbooking.room.service.impl;

import com.hotelbooking.room.dto.RoomRequest;
import com.hotelbooking.room.dto.RoomResponse;
import com.hotelbooking.room.entity.Room;
import com.hotelbooking.room.enums.RoomStatus;
import com.hotelbooking.room.exception.RoomNotFoundException;
import com.hotelbooking.room.repository.RoomRepository;
import com.hotelbooking.room.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;

    @Override
    @Transactional(readOnly = true)
    public List<RoomResponse> findAll() {
        return roomRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public RoomResponse findById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException(id));
        return toResponse(room);
    }

    @Override
    @Transactional
    public RoomResponse create(RoomRequest request) {
        Room room = toEntity(request);
        return toResponse(roomRepository.save(room));
    }

    @Override
    @Transactional
    public RoomResponse update(Long id, RoomRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException(id));

        room.setRoomNumber(request.getRoomNumber());
        room.setType(request.getType());
        room.setDescription(request.getDescription());
        room.setPricePerNight(request.getPricePerNight());
        room.setCapacity(request.getCapacity());
        room.setStatus(request.getStatus());
        room.setImageUrl(request.getImageUrl());
        room.setPromotionActive(request.getPromotionActive() != null ? request.getPromotionActive() : false);
        room.setPromotionTitle(request.getPromotionTitle());
        room.setPromotionDescription(request.getPromotionDescription());
        room.setDiscountPercent(request.getDiscountPercent());
        room.setPromotionPrice(request.getPromotionPrice());

        return toResponse(roomRepository.save(room));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new RoomNotFoundException(id);
        }
        roomRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomResponse> findAvailable() {
        return roomRepository.findByStatus(RoomStatus.AVAILABLE)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ── Mappers internos ────────────────────────────────────────────────────

    private RoomResponse toResponse(Room room) {
        return RoomResponse.builder()
                .id(room.getId())
                .roomNumber(room.getRoomNumber())
                .type(room.getType())
                .description(room.getDescription())
                .pricePerNight(room.getPricePerNight())
                .capacity(room.getCapacity())
                .status(room.getStatus())
                .imageUrl(room.getImageUrl())
                .promotionActive(room.getPromotionActive())
                .promotionTitle(room.getPromotionTitle())
                .promotionDescription(room.getPromotionDescription())
                .discountPercent(room.getDiscountPercent())
                .promotionPrice(room.getPromotionPrice())
                .build();
    }

    private Room toEntity(RoomRequest request) {
        return Room.builder()
                .roomNumber(request.getRoomNumber())
                .type(request.getType())
                .description(request.getDescription())
                .pricePerNight(request.getPricePerNight())
                .capacity(request.getCapacity())
                .status(request.getStatus())
                .imageUrl(request.getImageUrl())
                .promotionActive(request.getPromotionActive() != null ? request.getPromotionActive() : false)
                .promotionTitle(request.getPromotionTitle())
                .promotionDescription(request.getPromotionDescription())
                .discountPercent(request.getDiscountPercent())
                .promotionPrice(request.getPromotionPrice())
                .build();
    }
}

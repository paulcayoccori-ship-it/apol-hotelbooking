package com.hotelbooking.user.service;

import com.hotelbooking.user.dto.UserRequest;
import com.hotelbooking.user.dto.UserResponse;

import java.util.List;

public interface UserService {

    List<UserResponse> findAll();

    UserResponse findById(Long id);

    UserResponse findByEmail(String email);

    UserResponse create(UserRequest request);

    UserResponse update(Long id, UserRequest request);

    void delete(Long id);

    boolean existsById(Long id);
}

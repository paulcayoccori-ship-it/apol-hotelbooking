package com.hotelbooking.user.service;

import com.hotelbooking.user.dto.ClientLoginRequest;
import com.hotelbooking.user.dto.ClientRegisterRequest;
import com.hotelbooking.user.dto.ClientResponse;
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

    ClientResponse registerClient(ClientRegisterRequest request);

    ClientResponse loginClient(ClientLoginRequest request);
}

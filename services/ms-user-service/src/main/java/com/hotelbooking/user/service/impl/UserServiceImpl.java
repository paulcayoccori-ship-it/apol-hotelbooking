package com.hotelbooking.user.service.impl;

import com.hotelbooking.user.dto.ClientLoginRequest;
import com.hotelbooking.user.dto.ClientRegisterRequest;
import com.hotelbooking.user.dto.ClientResponse;
import com.hotelbooking.user.dto.UserRequest;
import com.hotelbooking.user.dto.UserResponse;
import com.hotelbooking.user.entity.User;
import com.hotelbooking.user.enums.DocumentType;
import com.hotelbooking.user.enums.UserRole;
import com.hotelbooking.user.exception.DocumentAlreadyExistsException;
import com.hotelbooking.user.exception.EmailAlreadyExistsException;
import com.hotelbooking.user.exception.InvalidCredentialsException;
import com.hotelbooking.user.exception.UserNotFoundException;
import com.hotelbooking.user.repository.UserRepository;
import com.hotelbooking.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> findAll() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse findById(Long id) {
        return toResponse(getOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse findByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(this::toResponse)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
    }

    @Override
    @Transactional
    public UserResponse create(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .enabled(request.getEnabled() != null ? request.getEnabled() : Boolean.TRUE)
                .build();
        return toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserResponse update(Long id, UserRequest request) {
        User user = getOrThrow(id);

        String currentEmail = user.getEmail();
        String newEmail     = request.getEmail();
        boolean emailChanged = (currentEmail == null)
                || !currentEmail.equalsIgnoreCase(newEmail);

        if (emailChanged && userRepository.existsByEmail(newEmail)) {
            throw new EmailAlreadyExistsException(newEmail);
        }

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        if (request.getEnabled() != null) {
            user.setEnabled(request.getEnabled());
        }

        return toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException(id);
        }
        userRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return userRepository.existsById(id);
    }

    // ── Client auth ────────────────────────────────────────────────────────

    @Override
    @Transactional
    public ClientResponse registerClient(ClientRegisterRequest request) {
        if (userRepository.existsByDocumentNumber(request.getDocumentNumber())) {
            throw new DocumentAlreadyExistsException(request.getDocumentNumber());
        }
        User user = User.builder()
                .fullName(request.getFullName())
                .documentType(DocumentType.valueOf(request.getDocumentType()))
                .documentNumber(request.getDocumentNumber())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.CUSTOMER)
                .enabled(Boolean.TRUE)
                .build();
        return toClientResponse(userRepository.save(user));
    }

    @Override
    @Transactional(readOnly = true)
    public ClientResponse loginClient(ClientLoginRequest request) {
        User user = userRepository.findByDocumentNumber(request.getDocumentNumber())
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }
        return toClientResponse(user);
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    private User getOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .enabled(user.getEnabled())
                .build();
    }

    private ClientResponse toClientResponse(User user) {
        return ClientResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .documentType(user.getDocumentType() != null ? user.getDocumentType().name() : null)
                .documentNumber(user.getDocumentNumber())
                .role(user.getRole().name())
                .phone(user.getPhone())
                .email(user.getEmail())
                .build();
    }
}

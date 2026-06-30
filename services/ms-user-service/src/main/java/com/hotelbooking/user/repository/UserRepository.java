package com.hotelbooking.user.repository;

import com.hotelbooking.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByDocumentNumber(String documentNumber);

    boolean existsByDocumentNumber(String documentNumber);
}

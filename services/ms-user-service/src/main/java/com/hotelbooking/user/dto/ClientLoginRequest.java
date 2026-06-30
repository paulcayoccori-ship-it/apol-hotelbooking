package com.hotelbooking.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientLoginRequest {

    @NotBlank(message = "Document number is required")
    private String documentNumber;

    @NotBlank(message = "Password is required")
    private String password;
}

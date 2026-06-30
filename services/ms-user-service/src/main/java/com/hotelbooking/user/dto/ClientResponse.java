package com.hotelbooking.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientResponse {

    private Long   id;
    private String fullName;
    private String documentType;
    private String documentNumber;
    private String role;
    private String phone;
    private String email;
}

package com.formationmanagement.training_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String login;
    private String role;
    private Integer userId;
}

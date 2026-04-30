package com.formationmanagement.training_management.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FormateurRequest {
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;
    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;
    @Email
    private String email;
    private String tel;
    private String type; // "interne" or "externe"
    private Integer employeurId;
}

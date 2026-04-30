package com.formationmanagement.training_management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class FormationRequest {
    @NotBlank(message = "Le titre est obligatoire")
    private String titre;
    private Integer annee;
    @Positive
    private Integer duree;
    @Positive
    private Double budget;
    private Integer domaineId;
    private Integer formateurId;
}

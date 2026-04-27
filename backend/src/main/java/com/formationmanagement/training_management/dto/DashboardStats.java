package com.formationmanagement.training_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private long totalFormations;
    private long totalParticipants;
    private long totalFormateurs;
    private long totalFormateursExternes;
    private double budgetTotal;
    private Integer anneeReference;
}

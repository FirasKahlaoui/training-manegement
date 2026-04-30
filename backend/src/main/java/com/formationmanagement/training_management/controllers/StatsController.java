package com.formationmanagement.training_management.controllers;

import com.formationmanagement.training_management.dto.DashboardStats;
import com.formationmanagement.training_management.services.FormationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin("*")
public class StatsController {

    @Autowired private FormationService formationService;

    /**
     * GET /api/stats/dashboard?annee=2025
     * Returns aggregated stats for the dashboard.
     * annee is optional; omit for global stats.
     */
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboard(
            @RequestParam(required = false) Integer annee) {
        return ResponseEntity.ok(formationService.getStats(annee));
    }
}

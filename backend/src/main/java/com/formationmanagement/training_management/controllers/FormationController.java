package com.formationmanagement.training_management.controllers;

import com.formationmanagement.training_management.dto.DashboardStats;
import com.formationmanagement.training_management.dto.FormationRequest;
import com.formationmanagement.training_management.models.Formation;
import com.formationmanagement.training_management.services.FormationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/formations")
@CrossOrigin("*")
public class FormationController {

    @Autowired private FormationService formationService;

    @GetMapping
    public List<Formation> getAll(@RequestParam(required = false) Integer annee,
                                   @RequestParam(required = false) Integer domaineId) {
        if (annee != null) return formationService.getByAnnee(annee);
        if (domaineId != null) return formationService.getByDomaine(domaineId);
        return formationService.getAll();
    }

    @GetMapping("/{id}")
    public Formation getById(@PathVariable Long id) { return formationService.getById(id); }

    @PostMapping
    public ResponseEntity<Formation> create(@Valid @RequestBody FormationRequest req) {
        return ResponseEntity.ok(formationService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Formation> update(@PathVariable Long id,
                                             @Valid @RequestBody FormationRequest req) {
        return ResponseEntity.ok(formationService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        formationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * POST /api/formations/{idFormation}/participants/{idParticipant}
     * Inscrit un participant à une formation
     */
    @PostMapping("/{idFormation}/participants/{idParticipant}")
    public ResponseEntity<Formation> inscrire(@PathVariable Long idFormation,
                                               @PathVariable Integer idParticipant) {
        return ResponseEntity.ok(formationService.inscrireParticipant(idFormation, idParticipant));
    }

    /**
     * DELETE /api/formations/{idFormation}/participants/{idParticipant}
     * Désinscrit un participant d'une formation
     */
    @DeleteMapping("/{idFormation}/participants/{idParticipant}")
    public ResponseEntity<Formation> desinscrire(@PathVariable Long idFormation,
                                                  @PathVariable Integer idParticipant) {
        return ResponseEntity.ok(formationService.desinscrireParticipant(idFormation, idParticipant));
    }
}

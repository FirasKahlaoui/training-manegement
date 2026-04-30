package com.formationmanagement.training_management.controllers;

import com.formationmanagement.training_management.models.Utilisateur;
import com.formationmanagement.training_management.services.UtilisateurService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@CrossOrigin("*")
public class UtilisateurController {

    @Autowired private UtilisateurService utilisateurService;

    @GetMapping
    public List<Utilisateur> getAll() { return utilisateurService.getAll(); }

    @GetMapping("/{id}")
    public Utilisateur getById(@PathVariable Integer id) { return utilisateurService.getById(id); }

    @PostMapping
    public ResponseEntity<Utilisateur> create(@Valid @RequestBody Utilisateur user) {
        return ResponseEntity.ok(utilisateurService.create(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Utilisateur> update(@PathVariable Integer id, @RequestBody Utilisateur user) {
        return ResponseEntity.ok(utilisateurService.update(id, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        utilisateurService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

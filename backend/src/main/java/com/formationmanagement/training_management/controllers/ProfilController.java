package com.formationmanagement.training_management.controllers;

import com.formationmanagement.training_management.models.Profil;
import com.formationmanagement.training_management.services.ProfilService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/profils")
@CrossOrigin("*")
public class ProfilController {

    @Autowired private ProfilService profilService;

    @GetMapping
    public List<Profil> getAll() { return profilService.getAll(); }

    @GetMapping("/{id}")
    public Profil getById(@PathVariable Integer id) { return profilService.getById(id); }

    @PostMapping
    public ResponseEntity<Profil> create(@Valid @RequestBody Profil p) {
        return ResponseEntity.ok(profilService.create(p));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Profil> update(@PathVariable Integer id, @Valid @RequestBody Profil p) {
        return ResponseEntity.ok(profilService.update(id, p));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        profilService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

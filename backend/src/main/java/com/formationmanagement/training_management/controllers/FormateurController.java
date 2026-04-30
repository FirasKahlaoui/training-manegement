package com.formationmanagement.training_management.controllers;

import com.formationmanagement.training_management.dto.FormateurRequest;
import com.formationmanagement.training_management.models.Formateur;
import com.formationmanagement.training_management.services.FormateurService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/formateurs")
@CrossOrigin("*")
public class FormateurController {

    @Autowired private FormateurService formateurService;

    @GetMapping
    public List<Formateur> getAll() { return formateurService.getAll(); }

    @GetMapping("/{id}")
    public Formateur getById(@PathVariable Integer id) { return formateurService.getById(id); }

    @GetMapping("/type/{type}")
    public List<Formateur> getByType(@PathVariable String type) {
        return formateurService.getByType(type);
    }

    @PostMapping
    public ResponseEntity<Formateur> create(@Valid @RequestBody FormateurRequest req) {
        return ResponseEntity.ok(formateurService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Formateur> update(@PathVariable Integer id, @Valid @RequestBody FormateurRequest req) {
        return ResponseEntity.ok(formateurService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        formateurService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

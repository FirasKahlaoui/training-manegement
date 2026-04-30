package com.formationmanagement.training_management.controllers;

import com.formationmanagement.training_management.models.Employeur;
import com.formationmanagement.training_management.services.EmployeurService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/employeurs")
@CrossOrigin("*")
public class EmployeurController {

    @Autowired private EmployeurService employeurService;

    @GetMapping
    public List<Employeur> getAll() { return employeurService.getAll(); }

    @GetMapping("/{id}")
    public Employeur getById(@PathVariable Integer id) { return employeurService.getById(id); }

    @PostMapping
    public ResponseEntity<Employeur> create(@Valid @RequestBody Employeur e) {
        return ResponseEntity.ok(employeurService.create(e));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employeur> update(@PathVariable Integer id, @Valid @RequestBody Employeur e) {
        return ResponseEntity.ok(employeurService.update(id, e));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        employeurService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

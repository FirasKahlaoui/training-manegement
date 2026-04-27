package com.formationmanagement.training_management.controllers;

import com.formationmanagement.training_management.models.Domaine;
import com.formationmanagement.training_management.services.DomaineService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/domaines")
@CrossOrigin("*")
public class DomaineController {

    @Autowired private DomaineService domaineService;

    @GetMapping
    public List<Domaine> getAll() { return domaineService.getAll(); }

    @GetMapping("/{id}")
    public Domaine getById(@PathVariable Integer id) { return domaineService.getById(id); }

    @PostMapping
    public ResponseEntity<Domaine> create(@Valid @RequestBody Domaine d) {
        return ResponseEntity.ok(domaineService.create(d));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Domaine> update(@PathVariable Integer id, @Valid @RequestBody Domaine d) {
        return ResponseEntity.ok(domaineService.update(id, d));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        domaineService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

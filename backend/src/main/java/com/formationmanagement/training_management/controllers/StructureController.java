package com.formationmanagement.training_management.controllers;

import com.formationmanagement.training_management.models.Structure;
import com.formationmanagement.training_management.services.StructureService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/structures")
@CrossOrigin("*")
public class StructureController {

    @Autowired private StructureService structureService;

    @GetMapping
    public List<Structure> getAll() { return structureService.getAll(); }

    @GetMapping("/{id}")
    public Structure getById(@PathVariable Integer id) { return structureService.getById(id); }

    @PostMapping
    public ResponseEntity<Structure> create(@Valid @RequestBody Structure s) {
        return ResponseEntity.ok(structureService.create(s));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Structure> update(@PathVariable Integer id, @Valid @RequestBody Structure s) {
        return ResponseEntity.ok(structureService.update(id, s));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        structureService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

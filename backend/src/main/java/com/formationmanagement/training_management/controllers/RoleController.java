package com.formationmanagement.training_management.controllers;

import com.formationmanagement.training_management.models.Role;
import com.formationmanagement.training_management.repositories.RoleRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin("*")
public class RoleController {

    @Autowired private RoleRepository roleRepository;

    @GetMapping
    public List<Role> getAll() { return roleRepository.findAll(); }

    @PostMapping
    public ResponseEntity<Role> create(@Valid @RequestBody Role role) {
        return ResponseEntity.ok(roleRepository.save(role));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        roleRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

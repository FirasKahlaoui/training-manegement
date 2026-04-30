package com.formationmanagement.training_management.controllers;

import com.formationmanagement.training_management.dto.ParticipantRequest;
import com.formationmanagement.training_management.models.Participant;
import com.formationmanagement.training_management.services.ParticipantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/participants")
@CrossOrigin("*")
public class ParticipantController {

    @Autowired private ParticipantService participantService;

    @GetMapping
    public List<Participant> getAll() { return participantService.getAll(); }

    @GetMapping("/{id}")
    public Participant getById(@PathVariable Integer id) { return participantService.getById(id); }

    @GetMapping("/search")
    public List<Participant> search(@RequestParam String q) {
        return participantService.search(q);
    }

    @PostMapping
    public ResponseEntity<Participant> create(@Valid @RequestBody ParticipantRequest req) {
        return ResponseEntity.ok(participantService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Participant> update(@PathVariable Integer id,
                                               @Valid @RequestBody ParticipantRequest req) {
        return ResponseEntity.ok(participantService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        participantService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

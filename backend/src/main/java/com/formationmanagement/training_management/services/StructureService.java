package com.formationmanagement.training_management.services;

import com.formationmanagement.training_management.models.Structure;
import com.formationmanagement.training_management.repositories.StructureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StructureService {

    @Autowired private StructureRepository structureRepository;

    public List<Structure> getAll() { return structureRepository.findAll(); }

    public Structure getById(Integer id) {
        return structureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Structure non trouvée"));
    }

    public Structure create(Structure s) {
        if (structureRepository.existsByLibelle(s.getLibelle())) {
            throw new RuntimeException("Cette structure existe déjà");
        }
        return structureRepository.save(s);
    }

    public Structure update(Integer id, Structure updated) {
        Structure existing = getById(id);
        existing.setLibelle(updated.getLibelle());
        return structureRepository.save(existing);
    }

    public void delete(Integer id) { structureRepository.deleteById(id); }
}

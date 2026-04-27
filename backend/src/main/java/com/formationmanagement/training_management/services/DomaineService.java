package com.formationmanagement.training_management.services;

import com.formationmanagement.training_management.models.Domaine;
import com.formationmanagement.training_management.repositories.DomaineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DomaineService {

    @Autowired private DomaineRepository domaineRepository;

    public List<Domaine> getAll() { return domaineRepository.findAll(); }

    public Domaine getById(Integer id) {
        return domaineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Domaine non trouvé"));
    }

    public Domaine create(Domaine d) {
        if (domaineRepository.existsByLibelle(d.getLibelle())) {
            throw new RuntimeException("Ce domaine existe déjà");
        }
        return domaineRepository.save(d);
    }

    public Domaine update(Integer id, Domaine updated) {
        Domaine existing = getById(id);
        existing.setLibelle(updated.getLibelle());
        return domaineRepository.save(existing);
    }

    public void delete(Integer id) { domaineRepository.deleteById(id); }
}

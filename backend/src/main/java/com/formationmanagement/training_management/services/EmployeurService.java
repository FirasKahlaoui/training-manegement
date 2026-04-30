package com.formationmanagement.training_management.services;

import com.formationmanagement.training_management.models.Employeur;
import com.formationmanagement.training_management.repositories.EmployeurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EmployeurService {

    @Autowired private EmployeurRepository employeurRepository;

    public List<Employeur> getAll() { return employeurRepository.findAll(); }

    public Employeur getById(Integer id) {
        return employeurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employeur non trouvé"));
    }

    public Employeur create(Employeur e) { return employeurRepository.save(e); }

    public Employeur update(Integer id, Employeur updated) {
        Employeur existing = getById(id);
        existing.setNomEmployeur(updated.getNomEmployeur());
        existing.setAdresse(updated.getAdresse());
        existing.setNom(updated.getNom());
        existing.setTelephone(updated.getTelephone());
        return employeurRepository.save(existing);
    }

    public void delete(Integer id) { employeurRepository.deleteById(id); }
}

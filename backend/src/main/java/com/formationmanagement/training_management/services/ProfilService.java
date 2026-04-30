package com.formationmanagement.training_management.services;

import com.formationmanagement.training_management.models.Profil;
import com.formationmanagement.training_management.repositories.ProfilRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProfilService {

    @Autowired private ProfilRepository profilRepository;

    public List<Profil> getAll() { return profilRepository.findAll(); }

    public Profil getById(Integer id) {
        return profilRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profil non trouvé"));
    }

    public Profil create(Profil p) {
        if (profilRepository.existsByLibelle(p.getLibelle())) {
            throw new RuntimeException("Ce profil existe déjà");
        }
        return profilRepository.save(p);
    }

    public Profil update(Integer id, Profil updated) {
        Profil existing = getById(id);
        existing.setLibelle(updated.getLibelle());
        return profilRepository.save(existing);
    }

    public void delete(Integer id) { profilRepository.deleteById(id); }
}

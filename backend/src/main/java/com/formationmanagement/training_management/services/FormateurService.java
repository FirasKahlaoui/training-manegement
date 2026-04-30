package com.formationmanagement.training_management.services;

import com.formationmanagement.training_management.dto.FormateurRequest;
import com.formationmanagement.training_management.models.Employeur;
import com.formationmanagement.training_management.models.Formateur;
import com.formationmanagement.training_management.repositories.EmployeurRepository;
import com.formationmanagement.training_management.repositories.FormateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FormateurService {

    @Autowired private FormateurRepository formateurRepository;
    @Autowired private EmployeurRepository employeurRepository;

    public List<Formateur> getAll() { return formateurRepository.findAll(); }

    public Formateur getById(Integer id) {
        return formateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formateur non trouvé"));
    }

    public List<Formateur> getByType(String type) {
        return formateurRepository.findByType(type);
    }

    public Formateur create(FormateurRequest req) {
        Formateur f = new Formateur();
        f.setNom(req.getNom());
        f.setPrenom(req.getPrenom());
        f.setEmail(req.getEmail());
        f.setTel(req.getTel());
        f.setType(req.getType());
        if (req.getEmployeurId() != null) {
            Employeur emp = employeurRepository.findById(req.getEmployeurId())
                    .orElseThrow(() -> new RuntimeException("Employeur non trouvé"));
            f.setEmployeur(emp);
        }
        return formateurRepository.save(f);
    }

    public Formateur update(Integer id, FormateurRequest req) {
        Formateur existing = getById(id);
        existing.setNom(req.getNom());
        existing.setPrenom(req.getPrenom());
        existing.setEmail(req.getEmail());
        existing.setTel(req.getTel());
        existing.setType(req.getType());
        if (req.getEmployeurId() != null) {
            Employeur emp = employeurRepository.findById(req.getEmployeurId())
                    .orElseThrow(() -> new RuntimeException("Employeur non trouvé"));
            existing.setEmployeur(emp);
        } else {
            existing.setEmployeur(null);
        }
        return formateurRepository.save(existing);
    }

    public void delete(Integer id) { formateurRepository.deleteById(id); }
}

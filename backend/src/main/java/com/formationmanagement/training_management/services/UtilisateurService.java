package com.formationmanagement.training_management.services;

import com.formationmanagement.training_management.models.Role;
import com.formationmanagement.training_management.models.Utilisateur;
import com.formationmanagement.training_management.repositories.RoleRepository;
import com.formationmanagement.training_management.repositories.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UtilisateurService {

    @Autowired private UtilisateurRepository utilisateurRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    public List<Utilisateur> getAll() {
        return utilisateurRepository.findAll();
    }

    public Utilisateur getById(Integer id) {
        return utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    public Utilisateur create(Utilisateur user) {
        if (utilisateurRepository.existsByLogin(user.getLogin())) {
            throw new RuntimeException("Ce login existe déjà");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return utilisateurRepository.save(user);
    }

    public Utilisateur update(Integer id, Utilisateur updated) {
        Utilisateur existing = getById(id);
        existing.setLogin(updated.getLogin());
        if (updated.getPassword() != null && !updated.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(updated.getPassword()));
        }
        if (updated.getRole() != null) {
            existing.setRole(updated.getRole());
        }
        return utilisateurRepository.save(existing);
    }

    public void delete(Integer id) {
        utilisateurRepository.deleteById(id);
    }
}

package com.formationmanagement.training_management.config;

import com.formationmanagement.training_management.models.Role;
import com.formationmanagement.training_management.models.Utilisateur;
import com.formationmanagement.training_management.repositories.RoleRepository;
import com.formationmanagement.training_management.repositories.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private RoleRepository roleRepository;
    @Autowired private UtilisateurRepository utilisateurRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Seed roles if not present
        seedRole("simple utilisateur");
        seedRole("responsable");
        seedRole("administrateur");

        // Seed default admin if not present
        if (!utilisateurRepository.existsByLogin("admin")) {
            Role adminRole = roleRepository.findByNom("administrateur")
                    .orElseThrow(() -> new RuntimeException("Role admin not found"));
            Utilisateur admin = new Utilisateur();
            admin.setLogin("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(adminRole);
            utilisateurRepository.save(admin);
            System.out.println(">>> Default admin created: login=admin / password=admin123");
        }
    }

    private void seedRole(String nom) {
        if (roleRepository.findByNom(nom).isEmpty()) {
            roleRepository.save(new Role(null, nom));
        }
    }
}

package com.formationmanagement.training_management.services;

import com.formationmanagement.training_management.config.JwtUtil;
import com.formationmanagement.training_management.dto.LoginRequest;
import com.formationmanagement.training_management.dto.LoginResponse;
import com.formationmanagement.training_management.models.Utilisateur;
import com.formationmanagement.training_management.repositories.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired private UtilisateurRepository utilisateurRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;
    
    public LoginResponse login(LoginRequest request) {
        Utilisateur user = utilisateurRepository.findByLogin(request.getLogin())
                .orElseThrow(() -> new RuntimeException("Login ou mot de passe incorrect"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Login ou mot de passe incorrect");
        }

        String role = user.getRole() != null ? user.getRole().getNom() : "utilisateur";
        String token = jwtUtil.generateToken(user.getLogin(), role);
        return new LoginResponse(token, user.getLogin(), role, user.getId());
    }
}

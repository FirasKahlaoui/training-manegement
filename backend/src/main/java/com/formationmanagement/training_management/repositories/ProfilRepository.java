package com.formationmanagement.training_management.repositories;

import com.formationmanagement.training_management.models.Profil;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfilRepository extends JpaRepository<Profil, Integer> {
    boolean existsByLibelle(String libelle);
}

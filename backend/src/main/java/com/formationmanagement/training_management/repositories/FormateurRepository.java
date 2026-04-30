package com.formationmanagement.training_management.repositories;

import com.formationmanagement.training_management.models.Formateur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FormateurRepository extends JpaRepository<Formateur, Integer> {
    List<Formateur> findByType(String type);
    long countByType(String type);
}

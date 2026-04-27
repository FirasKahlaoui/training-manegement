package com.formationmanagement.training_management.repositories;

import com.formationmanagement.training_management.models.Domaine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DomaineRepository extends JpaRepository<Domaine, Integer> {
    boolean existsByLibelle(String libelle);
}

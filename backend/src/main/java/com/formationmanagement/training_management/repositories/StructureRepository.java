package com.formationmanagement.training_management.repositories;

import com.formationmanagement.training_management.models.Structure;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StructureRepository extends JpaRepository<Structure, Integer> {
    boolean existsByLibelle(String libelle);
}

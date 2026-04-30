package com.formationmanagement.training_management.repositories;

import com.formationmanagement.training_management.models.Employeur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeurRepository extends JpaRepository<Employeur, Integer> {
}

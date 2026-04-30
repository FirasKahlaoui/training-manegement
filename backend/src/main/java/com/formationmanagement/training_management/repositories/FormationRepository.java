package com.formationmanagement.training_management.repositories;

import com.formationmanagement.training_management.models.Formation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface FormationRepository extends JpaRepository<Formation, Long> {
    List<Formation> findByAnnee(Integer annee);
    List<Formation> findByDomaineId(Integer domaineId);

    @Query("SELECT COALESCE(SUM(f.budget), 0) FROM Formation f WHERE f.annee = :annee")
    Double sumBudgetByAnnee(@Param("annee") Integer annee);

    @Query("SELECT COUNT(f) FROM Formation f WHERE f.annee = :annee")
    long countByAnnee(@Param("annee") Integer annee);

    @Query("SELECT COUNT(DISTINCT p) FROM Formation f JOIN f.participants p WHERE f.annee = :annee")
    long countDistinctParticipantsByAnnee(@Param("annee") Integer annee);
}

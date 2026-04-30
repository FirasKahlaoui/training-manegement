package com.formationmanagement.training_management.repositories;

import com.formationmanagement.training_management.models.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ParticipantRepository extends JpaRepository<Participant, Integer> {
    List<Participant> findByStructureId(Integer structureId);
    List<Participant> findByProfilId(Integer profilId);

    @Query("SELECT p FROM Participant p WHERE LOWER(p.nom) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.prenom) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Participant> searchByNomOrPrenom(@Param("search") String search);
}

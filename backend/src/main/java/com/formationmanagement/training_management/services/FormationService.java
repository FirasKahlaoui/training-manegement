package com.formationmanagement.training_management.services;

import com.formationmanagement.training_management.dto.DashboardStats;
import com.formationmanagement.training_management.dto.FormationRequest;
import com.formationmanagement.training_management.models.Domaine;
import com.formationmanagement.training_management.models.Formateur;
import com.formationmanagement.training_management.models.Formation;
import com.formationmanagement.training_management.models.Participant;
import com.formationmanagement.training_management.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FormationService {

    @Autowired private FormationRepository formationRepository;
    @Autowired private ParticipantRepository participantRepository;
    @Autowired private DomaineRepository domaineRepository;
    @Autowired private FormateurRepository formateurRepository;

    public List<Formation> getAll() { return formationRepository.findAll(); }

    public Formation getById(Long id) {
        return formationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formation non trouvée"));
    }

    public List<Formation> getByAnnee(Integer annee) {
        return formationRepository.findByAnnee(annee);
    }

    public List<Formation> getByDomaine(Integer domaineId) {
        return formationRepository.findByDomaineId(domaineId);
    }

    public Formation create(FormationRequest req) {
        Formation f = buildFromRequest(new Formation(), req);
        return formationRepository.save(f);
    }

    public Formation update(Long id, FormationRequest req) {
        Formation existing = getById(id);
        buildFromRequest(existing, req);
        return formationRepository.save(existing);
    }

    public void delete(Long id) { formationRepository.deleteById(id); }

    @Transactional
    public Formation inscrireParticipant(Long formationId, Integer participantId) {
        Formation formation = getById(formationId);
        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new RuntimeException("Participant non trouvé"));

        if (!formation.getParticipants().contains(participant)) {
            formation.getParticipants().add(participant);
            formationRepository.save(formation);
        }
        return formation;
    }

    @Transactional
    public Formation desinscrireParticipant(Long formationId, Integer participantId) {
        Formation formation = getById(formationId);
        formation.getParticipants().removeIf(p -> p.getId().equals(participantId));
        return formationRepository.save(formation);
    }

    public DashboardStats getStats(Integer annee) {
        long totalFormations = annee != null
                ? formationRepository.countByAnnee(annee)
                : formationRepository.count();

        long totalParticipants = annee != null
                ? formationRepository.countDistinctParticipantsByAnnee(annee)
                : participantRepository.count();

        long totalFormateurs = formateurRepository.count();
        long formateursExternes = formateurRepository.countByType("externe");

        Double budget = annee != null
                ? formationRepository.sumBudgetByAnnee(annee)
                : null;

        return new DashboardStats(
                totalFormations,
                totalParticipants,
                totalFormateurs,
                formateursExternes,
                budget != null ? budget : 0.0,
                annee
        );
    }

    private Formation buildFromRequest(Formation f, FormationRequest req) {
        f.setTitre(req.getTitre());
        f.setAnnee(req.getAnnee());
        f.setDuree(req.getDuree());
        f.setBudget(req.getBudget());
        if (req.getDomaineId() != null) {
            Domaine d = domaineRepository.findById(req.getDomaineId())
                    .orElseThrow(() -> new RuntimeException("Domaine non trouvé"));
            f.setDomaine(d);
        }
        if (req.getFormateurId() != null) {
            Formateur fm = formateurRepository.findById(req.getFormateurId())
                    .orElseThrow(() -> new RuntimeException("Formateur non trouvé"));
            f.setFormateur(fm);
        }
        return f;
    }
}

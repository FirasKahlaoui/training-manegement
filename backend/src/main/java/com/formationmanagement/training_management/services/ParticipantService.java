package com.formationmanagement.training_management.services;

import com.formationmanagement.training_management.dto.ParticipantRequest;
import com.formationmanagement.training_management.models.Participant;
import com.formationmanagement.training_management.models.Profil;
import com.formationmanagement.training_management.models.Structure;
import com.formationmanagement.training_management.repositories.ParticipantRepository;
import com.formationmanagement.training_management.repositories.ProfilRepository;
import com.formationmanagement.training_management.repositories.StructureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ParticipantService {

    @Autowired private ParticipantRepository participantRepository;
    @Autowired private StructureRepository structureRepository;
    @Autowired private ProfilRepository profilRepository;

    public List<Participant> getAll() { return participantRepository.findAll(); }

    public Participant getById(Integer id) {
        return participantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Participant non trouvé"));
    }

    public List<Participant> search(String query) {
        return participantRepository.searchByNomOrPrenom(query);
    }

    public Participant create(ParticipantRequest req) {
        Participant p = new Participant();
        p.setNom(req.getNom());
        p.setPrenom(req.getPrenom());
        p.setEmail(req.getEmail());
        p.setTel(req.getTel());
        if (req.getStructureId() != null) {
            Structure s = structureRepository.findById(req.getStructureId())
                    .orElseThrow(() -> new RuntimeException("Structure non trouvée"));
            p.setStructure(s);
        }
        if (req.getProfilId() != null) {
            Profil pr = profilRepository.findById(req.getProfilId())
                    .orElseThrow(() -> new RuntimeException("Profil non trouvé"));
            p.setProfil(pr);
        }
        return participantRepository.save(p);
    }

    public Participant update(Integer id, ParticipantRequest req) {
        Participant existing = getById(id);
        existing.setNom(req.getNom());
        existing.setPrenom(req.getPrenom());
        existing.setEmail(req.getEmail());
        existing.setTel(req.getTel());
        if (req.getStructureId() != null) {
            Structure s = structureRepository.findById(req.getStructureId())
                    .orElseThrow(() -> new RuntimeException("Structure non trouvée"));
            existing.setStructure(s);
        }
        if (req.getProfilId() != null) {
            Profil pr = profilRepository.findById(req.getProfilId())
                    .orElseThrow(() -> new RuntimeException("Profil non trouvé"));
            existing.setProfil(pr);
        }
        return participantRepository.save(existing);
    }

    public void delete(Integer id) { participantRepository.deleteById(id); }
}

package com.formationmanagement.training_management.config;

import com.formationmanagement.training_management.models.*;
import com.formationmanagement.training_management.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private RoleRepository roleRepository;
    @Autowired private UtilisateurRepository utilisateurRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    
    @Autowired private DomaineRepository domaineRepository;
    @Autowired private StructureRepository structureRepository;
    @Autowired private ProfilRepository profilRepository;
    @Autowired private EmployeurRepository employeurRepository;
    @Autowired private FormateurRepository formateurRepository;
    @Autowired private ParticipantRepository participantRepository;
    @Autowired private FormationRepository formationRepository;

    @Override
    public void run(String... args) {
        // Seed roles and admin
        seedRole("simple utilisateur");
        seedRole("responsable");
        seedRole("administrateur");

        if (!utilisateurRepository.existsByLogin("admin")) {
            Role adminRole = roleRepository.findByNom("administrateur")
                    .orElseThrow(() -> new RuntimeException("Role admin not found"));
            Utilisateur admin = new Utilisateur();
            admin.setLogin("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(adminRole);
            utilisateurRepository.save(admin);
            System.out.println(">>> Default admin created: login=admin / password=admin123");
        }

        // Generate Mock Data for 5 years if DB is empty
        if (formationRepository.count() == 0) {
            System.out.println(">>> Generating 5 years of mock data...");
            generateMockData();
            System.out.println(">>> Mock data generation complete!");
        }
    }

    private void seedRole(String nom) {
        if (roleRepository.findByNom(nom).isEmpty()) {
            roleRepository.save(new Role(null, nom));
        }
    }

    private void generateMockData() {
        Random rand = new Random();

        // 1. Domaines
        List<Domaine> domaines = new ArrayList<>();
        for (String libelle : Arrays.asList("Informatique & IT", "Management & Leadership", "Finance & Comptabilité", "Ressources Humaines", "Marketing Digital", "Sécurité au Travail")) {
            Domaine d = new Domaine();
            d.setLibelle(libelle);
            domaines.add(domaineRepository.save(d));
        }

        // 2. Structures
        List<Structure> structures = new ArrayList<>();
        for (String libelle : Arrays.asList("Département IT", "Direction Générale", "Service RH", "Département Commercial", "Production", "Logistique")) {
            Structure s = new Structure();
            s.setLibelle(libelle);
            structures.add(structureRepository.save(s));
        }

        // 3. Profils
        List<Profil> profils = new ArrayList<>();
        for (String libelle : Arrays.asList("Ingénieur", "Technicien", "Manager", "Directeur", "Assistant", "Consultant")) {
            Profil p = new Profil();
            p.setLibelle(libelle);
            profils.add(profilRepository.save(p));
        }

        // 4. Employeurs
        List<Employeur> employeurs = new ArrayList<>();
        for (String nom : Arrays.asList("TechCorp", "ConsultingGroup", "EduPro", "DataExperts")) {
            Employeur e = new Employeur();
            e.setNom(nom);
            e.setAdresse("Adresse de " + nom);
            e.setTel("0500" + (100000 + rand.nextInt(900000)));
            e.setEmail("contact@" + nom.toLowerCase() + ".com");
            employeurs.add(employeurRepository.save(e));
        }

        // 5. Formateurs
        List<Formateur> formateurs = new ArrayList<>();
        String[] formateurNoms = {"Dupont", "Martin", "Bernard", "Thomas", "Petit", "Robert", "Richard", "Durand", "Dubois", "Moreau"};
        String[] formateurPrenoms = {"Jean", "Pierre", "Michel", "Jacques", "Philippe", "Nicolas", "Christophe", "Patrick", "Christian", "Claude"};
        for (int i = 0; i < 15; i++) {
            Formateur f = new Formateur();
            f.setNom(formateurNoms[rand.nextInt(formateurNoms.length)]);
            f.setPrenom(formateurPrenoms[rand.nextInt(formateurPrenoms.length)]);
            f.setEmail("formateur" + i + "@example.com");
            f.setTel("0600" + (100000 + rand.nextInt(900000)));
            f.setType(rand.nextBoolean() ? "interne" : "externe");
            if (f.getType().equals("externe")) {
                f.setEmployeur(employeurs.get(rand.nextInt(employeurs.size())));
            }
            formateurs.add(formateurRepository.save(f));
        }

        // 6. Participants
        List<Participant> participants = new ArrayList<>();
        String[] partNoms = {"Leroy", "Roux", "Simon", "Laurent", "Lefebvre", "Mercier", "Blanc", "Garnier", "Guerin", "Lemaire", "Francois", "Perrin", "Mathieu", "Clement", "Gauthier"};
        String[] partPrenoms = {"Marie", "Nathalie", "Isabelle", "Sylvie", "Catherine", "Francoise", "Martine", "Christine", "Monique", "Valerie", "Sandrine", "Sophie", "Veronique", "Celine", "Chantal"};
        for (int i = 0; i < 60; i++) {
            Participant p = new Participant();
            p.setNom(partNoms[rand.nextInt(partNoms.length)]);
            p.setPrenom(partPrenoms[rand.nextInt(partPrenoms.length)]);
            p.setEmail("participant" + i + "@company.com");
            p.setTel("0700" + (100000 + rand.nextInt(900000)));
            p.setStructure(structures.get(rand.nextInt(structures.size())));
            p.setProfil(profils.get(rand.nextInt(profils.size())));
            participants.add(participantRepository.save(p));
        }

        // 7. Formations (2020 - 2025)
        String[] titresPrefix = {"Initiation à", "Perfectionnement en", "Maîtrise de", "Les fondamentaux de", "Atelier pratique:"};
        for (int annee = 2020; annee <= 2025; annee++) {
            int numFormations = 15 + rand.nextInt(15); // 15 to 30 formations per year
            for (int i = 0; i < numFormations; i++) {
                Domaine d = domaines.get(rand.nextInt(domaines.size()));
                Formateur f = formateurs.get(rand.nextInt(formateurs.size()));
                
                Formation form = new Formation();
                form.setTitre(titresPrefix[rand.nextInt(titresPrefix.length)] + " " + d.getLibelle());
                form.setAnnee(annee);
                form.setDuree(1 + rand.nextInt(5)); // 1 to 5 days
                form.setBudget(10000.0 + rand.nextInt(90000)); // 10k to 100k DA
                form.setDomaine(d);
                form.setFormateur(f);

                // Assign random participants (3 to 12 per formation)
                int numParticipants = 3 + rand.nextInt(10);
                List<Participant> sessionParticipants = new ArrayList<>();
                for (int j = 0; j < numParticipants; j++) {
                    Participant p = participants.get(rand.nextInt(participants.size()));
                    if (!sessionParticipants.contains(p)) {
                        sessionParticipants.add(p);
                    }
                }
                form.setParticipants(sessionParticipants);

                formationRepository.save(form);
            }
        }
    }
}

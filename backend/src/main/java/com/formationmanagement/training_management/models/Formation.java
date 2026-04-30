package com.formationmanagement.training_management.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "formation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Formation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @NotBlank(message = "Le titre est obligatoire")
    @Size(max = 200)
    @Column(name = "Titre", nullable = false, length = 200)
    private String titre;

    @Column(name = "Annee")
    private Integer annee;

    @Positive(message = "La durée doit être positive")
    @Column(name = "Duree")
    private Integer duree;

    @Positive(message = "Le budget doit être positif")
    @Column(name = "Budget")
    private Double budget;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idDomaine")
    private Domaine domaine;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idFormateur")
    private Formateur formateur;

    @ManyToMany
    @JoinTable(
        name = "formation_participant",
        joinColumns = @JoinColumn(name = "formation_id"),
        inverseJoinColumns = @JoinColumn(name = "participant_id")
    )
    private List<Participant> participants = new ArrayList<>();
}

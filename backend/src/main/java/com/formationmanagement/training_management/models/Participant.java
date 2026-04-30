package com.formationmanagement.training_management.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "participant")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Participant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 100)
    @Column(name = "Nom", nullable = false, length = 100)
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    @Size(max = 100)
    @Column(name = "Prenom", nullable = false, length = 100)
    private String prenom;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "IdStructure")
    private Structure structure;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idProfil")
    private Profil profil;

    @Email(message = "Format d'email invalide")
    @Size(max = 150)
    @Column(name = "Email", length = 150)
    private String email;

    @Size(max = 20)
    @Column(name = "Tel", length = 20)
    private String tel;

    @ManyToMany(mappedBy = "participants")
    @JsonIgnore
    private List<Formation> formations = new ArrayList<>();
}

package com.formationmanagement.training_management.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "formateur")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Formateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 100)
    @Column(name = "Nom", nullable = false, length = 100)
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    @Size(max = 100)
    @Column(name = "Prenom", nullable = false, length = 100)
    private String prenom;

    @Email(message = "Format d'email invalide")
    @Size(max = 150)
    @Column(name = "Email", length = 150)
    private String email;

    @Size(max = 20)
    @Column(name = "Tel", length = 20)
    private String tel;

    @Size(max = 20)
    @Column(name = "Type", length = 20)
    private String type; // "interne" or "externe"

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "IdEmployeur")
    private Employeur employeur;
}

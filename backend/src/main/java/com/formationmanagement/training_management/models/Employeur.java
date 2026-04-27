package com.formationmanagement.training_management.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "employeur")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employeur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @NotBlank(message = "Le nom de l'employeur est obligatoire")
    @Size(max = 100)
    @Column(name = "nomemployeur", nullable = false, length = 100)
    private String nomEmployeur;

    @Size(max = 255)
    @Column(name = "adresse", length = 255)
    private String adresse;

    @Size(max = 255)
    @Column(name = "nom", length = 255)
    private String nom;

    @Size(max = 255)
    @Column(name = "telephone", length = 255)
    private String telephone;
}

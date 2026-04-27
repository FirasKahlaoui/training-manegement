package com.formationmanagement.training_management.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "utilisateur")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @NotBlank(message = "Le login est obligatoire")
    @Size(max = 100)
    @Column(name = "Login", nullable = false, unique = true, length = 100)
    private String login;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(max = 255)
    @Column(name = "Password", nullable = false, length = 255)
    private String password;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idRole")
    private Role role;
}

package com.example.Phy6_Master.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    public enum Role {
        STUDENT,
        TEACHER,
        TUTOR,
        ACCOUNTANT,
        ADMIN
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    private String name;

    private String email;

    private String phoneNumber;

    private Boolean isActive;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
}
package com.example.backend.entities;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class User {

    // Assuming User class has some fields, getters, and setters
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @jakarta.persistence.Column(unique = true)
    private String email;

    private String name;

    // @JsonIgnore
    private String password;

    private String phone;

    private String city;

    private String country;

    private String state;

    private String pincode;

    private Date createdAt;

}

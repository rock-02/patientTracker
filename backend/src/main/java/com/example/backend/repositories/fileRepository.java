package com.example.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.entities.documents;

@Repository
public interface fileRepository extends JpaRepository<documents, Long> {

}
package com.example.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.entities.User;
import com.example.backend.entities.documents;

@Repository
public interface fileRepository extends JpaRepository<documents, Long> {

    List<documents> findAllByUser(User user);

    documents deleteByIdAndUser(Long id, User user);

    Optional<documents> findByIdAndUser(Long id, User user);
}
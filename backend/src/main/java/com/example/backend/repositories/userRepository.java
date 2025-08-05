package com.example.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.entities.User;

@Repository
public interface userRepository extends JpaRepository<User, Long> {

    User findByEmail(String username);
    
    
}

package com.example.backend.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.entities.User;
import com.example.backend.config.jwtProvider;
import com.example.backend.repositories.userRepository;

@Service
public class UserServiceImplementation implements UserService {

    @Autowired
    private userRepository userRepository;

    @Override
    public User findUserByID(Long id) throws Exception {
        Optional<User> user = userRepository.findById(id);

        if (user.isEmpty()) {
            throw new Exception("User not found");
        }

        return user.get();

    }

    @Override
    public User findUserByEmail(String email) throws Exception {

        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new UnsupportedOperationException("User not found");
        }

        return user;

    }

    @Override
    public User findUserByJwt(String jwt) throws Exception {
        String email = jwtProvider.getEmailFromJwtToken(jwt);

        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new UnsupportedOperationException("User not found");
        }

        return user;
    }

}

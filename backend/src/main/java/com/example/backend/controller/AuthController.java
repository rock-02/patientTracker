package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.config.jwtProvider;
import com.example.backend.entities.User;
import com.example.backend.models.LoginRequest;
import com.example.backend.response.AuthResponse;
import com.example.backend.services.CustomUserService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private com.example.backend.repositories.userRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CustomUserService customUserService;

    @GetMapping("/")
    public String home() {
        return "Welcome to the home page";
    }

    @PostMapping("/signup")
    public AuthResponse RegisterUser(@RequestBody User user) {

        System.out.println("Registering user: " + user.getEmail());
        User isUserExist = userRepository.findByEmail(user.getEmail());

        if (isUserExist != null) {
            throw new BadCredentialsException("User already exist");
        }

        User newUser = new User();

        newUser.setName(user.getName());
        newUser.setEmail(user.getEmail());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setPhone(user.getPhone());
        newUser.setState(user.getState());
        newUser.setCountry(user.getCountry());
        newUser.setCity(user.getCity());
        newUser.setPincode(user.getPincode());

        User savedUser = userRepository.save(newUser);

        Authentication authentication = new UsernamePasswordAuthenticationToken(savedUser.getEmail(),
                savedUser.getPassword());

        String token = jwtProvider.generateToken(authentication);

        AuthResponse authResponse = new AuthResponse(token, "User registered successfully");

        return authResponse;
    }

    @PostMapping("/login")
    public AuthResponse LoginUser(@RequestBody LoginRequest loginRequest) {

        Authentication authentication = authentication(loginRequest.getEmail(), loginRequest.getPassword());

        String token = jwtProvider.generateToken(authentication);

        AuthResponse authResponse = new AuthResponse(token, "User logged in successfully");

        return authResponse;

    }

    private Authentication authentication(String email, String password) throws BadCredentialsException {

        UserDetails user = customUserService
                .loadUserByUsername(email);

        if (user == null) {
            throw new BadCredentialsException("User not found");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }

        Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());

        return authentication;
    }

}

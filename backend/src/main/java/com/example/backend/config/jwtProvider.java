package com.example.backend.config;

import java.util.Date;

import org.springframework.security.core.Authentication;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

public class jwtProvider {

    public static String generateToken(Authentication authentication) {

        String jwt = Jwts.builder()
                .setSubject(authentication.getName())
                .claim("email", authentication.getName())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 864000000))
                .signWith(jwtConstant.JWT_SECRET_KEY)
                .compact();

        return jwt;
    }

    public static String getEmailFromJwtToken(String jwt) {
        jwt = jwt.substring(7);

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(jwtConstant.JWT_SECRET_KEY)
                .build()
                .parseClaimsJws(jwt)
                .getBody();

        String email = claims.getSubject();

        return email;

    }

}

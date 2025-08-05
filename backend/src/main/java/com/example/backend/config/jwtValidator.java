package com.example.backend.config;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class jwtValidator extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Skip JWT validation for public routes
        if (isPublicPath(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = request.getHeader(jwtConstant.JWT_HEADER);

        if (jwt != null && jwt.startsWith("Bearer ")) {
            try {
                String email = jwtProvider.getEmailFromJwtToken(jwt);

                List<GrantedAuthority> authorities = new ArrayList<>();

                Authentication authentication = new UsernamePasswordAuthenticationToken(email, null, authorities);

                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (Exception e) {
                // Instead of throwing exception, send proper JSON response
                response.setContentType("application/json");
                response.setStatus(401);
                response.getWriter().write(
                        "{\"error\":\"Invalid Token\",\"message\":\"The provided JWT token is invalid or expired\"}");
                return;
            }
        } else if (jwt != null) {
            // Token exists but doesn't have Bearer prefix
            response.setContentType("application/json");
            response.setStatus(401);
            response.getWriter().write(
                    "{\"error\":\"Invalid Token Format\",\"message\":\"Authorization header must start with 'Bearer '\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isPublicPath(String path) {
        // List of public paths that don't require authentication
        return path.startsWith("/auth/") ||
                path.equals("/") ||
                path.startsWith("/public/") ||
                path.startsWith("/error");
    }

}

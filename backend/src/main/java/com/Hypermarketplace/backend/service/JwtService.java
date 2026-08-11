package com.Hypermarketplace.backend.service;

import com.Hypermarketplace.backend.config.JwtConfig;
import com.Hypermarketplace.backend.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final JwtConfig jwtConfig;

    private final long expirationTime = 1000 * 60 * 60;

    public JwtService(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }

    public String generateToken(User user) {

        SecretKey key = Keys.hmacShaKeyFor(
                jwtConfig.getSecretKey()
                        .getBytes(StandardCharsets.UTF_8)
        );

        return Jwts.builder()
                .subject(user.getId())
                .claim("email", user.getEmail())
                .claim("role", user.getRole())
                .issuedAt(new Date())
                .expiration(
                        new Date(System.currentTimeMillis()
                                + expirationTime)
                )
                .signWith(key)
                .compact();
    }
}
package com.Hypermarketplace.backend.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {

    private final String secretKey =
            "ServiceHubSecretKeyForDevelopmentOnly123456789";

    public String getSecretKey() {
        return secretKey;
    }
}
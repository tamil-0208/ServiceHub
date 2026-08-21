package com.Hypermarketplace.backend.controller;

import com.Hypermarketplace.backend.dto.ProviderRequest;
import com.Hypermarketplace.backend.dto.ProviderResponse;
import com.Hypermarketplace.backend.service.ProviderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/providers")
public class ProviderController {

    private final ProviderService providerService;

    public ProviderController(ProviderService providerService) {
        this.providerService = providerService;
    }

    @PostMapping
    public ResponseEntity<ProviderResponse> createProvider(
            @Valid @RequestBody ProviderRequest request,
            Authentication authentication) {

        String userId = authentication.getName();

        ProviderResponse response =
                providerService.createProvider(userId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<ProviderResponse> getMyProviderProfile(
            Authentication authentication) {

        String userId = authentication.getName();

        ProviderResponse response =
                providerService.getProviderByUserId(userId);

        return ResponseEntity.ok(response);
    }
}
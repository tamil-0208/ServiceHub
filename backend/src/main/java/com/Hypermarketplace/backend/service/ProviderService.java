package com.Hypermarketplace.backend.service;

import com.Hypermarketplace.backend.dto.ProviderRequest;
import com.Hypermarketplace.backend.dto.ProviderResponse;
import com.Hypermarketplace.backend.model.Provider;
import com.Hypermarketplace.backend.repository.ProviderRepository;
import org.springframework.stereotype.Service;

@Service
public class ProviderService {

    private final ProviderRepository providerRepository;

    public ProviderService(ProviderRepository providerRepository) {
        this.providerRepository = providerRepository;
    }

    public ProviderResponse createProvider(
            String userId,
            ProviderRequest request) {

        if (providerRepository.existsByUserId(userId)) {
            throw new RuntimeException("Provider profile already exists");
        }

        Provider provider = new Provider();

        provider.setUserId(userId);
        provider.setBusinessName(request.getBusinessName());
        provider.setDescription(request.getDescription());
        provider.setPhone(request.getPhone());
        provider.setExperience(request.getExperience());
        provider.setAddress(request.getAddress());

        // New providers are not verified by default
        provider.setVerified(false);

        Provider savedProvider = providerRepository.save(provider);

        return new ProviderResponse(savedProvider);
    }

    public ProviderResponse getProviderByUserId(String userId) {

        Provider provider = providerRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException("Provider profile not found"));

        return new ProviderResponse(provider);
    }
}
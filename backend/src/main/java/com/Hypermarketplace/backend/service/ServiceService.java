package com.Hypermarketplace.backend.service;

import com.Hypermarketplace.backend.dto.ServiceRequest;
import com.Hypermarketplace.backend.dto.ServiceResponse;
import com.Hypermarketplace.backend.exception.ResourceNotFoundException;
import com.Hypermarketplace.backend.model.Category;
import com.Hypermarketplace.backend.model.Provider;
import com.Hypermarketplace.backend.model.Service;
import com.Hypermarketplace.backend.repository.CategoryRepository;
import com.Hypermarketplace.backend.repository.ProviderRepository;
import com.Hypermarketplace.backend.repository.ServiceRepository;


import java.util.List;
import java.util.stream.Collectors;
import com.Hypermarketplace.backend.model.Service;

@org.springframework.stereotype.Service
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final CategoryRepository categoryRepository;
    private final ProviderRepository providerRepository;

    public ServiceService(ServiceRepository serviceRepository, CategoryRepository categoryRepository, ProviderRepository providerRepository) {
        this.serviceRepository = serviceRepository;
        this.categoryRepository = categoryRepository;
        this.providerRepository = providerRepository;
    }

    public ServiceResponse createService(String userId, ServiceRequest request) {
        // Get the provider profile for the authenticated user
        Provider provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found for this user"));

        // Validate that the category exists and is active
        Category category = categoryRepository.findByIdAndActiveTrue(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found or inactive"));

        Service service = new Service();
        service.setProviderId(provider.getId());
        service.setCategoryId(request.getCategoryId());
        service.setTitle(request.getTitle());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setDurationMinutes(request.getDurationMinutes());
        service.setActive(true);

        Service savedService = serviceRepository.save(service);
        return new ServiceResponse(savedService);
    }

    public List<ServiceResponse> getAllServices(String categoryId, String providerId) {
        List<Service> services;

        if (categoryId != null && providerId != null) {
            services = serviceRepository.findByActiveTrueAndCategoryId(categoryId).stream()
                    .filter(service -> service.getProviderId().equals(providerId))
                    .collect(Collectors.toList());
        } else if (categoryId != null) {
            services = serviceRepository.findByActiveTrueAndCategoryId(categoryId);
        } else if (providerId != null) {
            services = serviceRepository.findByActiveTrueAndProviderId(providerId);
        } else {
            services = serviceRepository.findByActiveTrue();
        }

        return services.stream()
                .map(ServiceResponse::new)
                .collect(Collectors.toList());
    }

    public List<ServiceResponse> getServicesByProviderId(String providerId) {
        List<Service> services = serviceRepository.findByActiveTrueAndProviderId(providerId);
        return services.stream()
                .map(ServiceResponse::new)
                .collect(Collectors.toList());
    }

    public ServiceResponse getServiceById(String id) {
        Service service = serviceRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
        return new ServiceResponse(service);
    }

    public ServiceResponse updateService(String userId, String id, ServiceRequest request) {
        // Get the provider profile for the authenticated user
        Provider provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found for this user"));

        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));

        // Check ownership - the service must belong to the authenticated user's provider profile
        if (!service.getProviderId().equals(provider.getId())) {
            throw new ResourceNotFoundException("Service not found or you don't have permission to edit it");
        }

        // Validate that the category exists and is active
        Category category = categoryRepository.findByIdAndActiveTrue(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found or inactive"));

        service.setCategoryId(request.getCategoryId());
        service.setTitle(request.getTitle());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setDurationMinutes(request.getDurationMinutes());

        Service updatedService = serviceRepository.save(service);
        return new ServiceResponse(updatedService);
    }

    public ServiceResponse softDeleteService(String userId, String id) {
        // Get the provider profile for the authenticated user
        Provider provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found for this user"));

        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));

        // Check ownership - the service must belong to the authenticated user's provider profile
        if (!service.getProviderId().equals(provider.getId())) {
            throw new ResourceNotFoundException("Service not found or you don't have permission to delete it");
        }

        service.setActive(false);
        Service deactivatedService = serviceRepository.save(service);
        return new ServiceResponse(deactivatedService);
    }
}

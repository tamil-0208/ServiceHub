package com.Hypermarketplace.backend.controller;

import com.Hypermarketplace.backend.dto.ServiceRequest;
import com.Hypermarketplace.backend.dto.ServiceResponse;
import com.Hypermarketplace.backend.service.ServiceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    private final ServiceService serviceService;

    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    @PostMapping
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ServiceResponse> createService(
            @Valid @RequestBody ServiceRequest request,
            Authentication authentication) {

        String userId = authentication.getName();
        ServiceResponse response = serviceService.createService(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ServiceResponse>> getAllServices(
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) String providerId) {

        List<ServiceResponse> services = serviceService.getAllServices(categoryId, providerId);
        return ResponseEntity.ok(services);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceResponse> getServiceById(@PathVariable String id) {
        ServiceResponse service = serviceService.getServiceById(id);
        return ResponseEntity.ok(service);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ServiceResponse> updateService(
            @PathVariable String id,
            @Valid @RequestBody ServiceRequest request,
            Authentication authentication) {

        String userId = authentication.getName();
        ServiceResponse response = serviceService.updateService(userId, id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ServiceResponse> deleteService(
            @PathVariable String id,
            Authentication authentication) {

        String userId = authentication.getName();
        ServiceResponse response = serviceService.softDeleteService(userId, id);
        return ResponseEntity.ok(response);
    }
}

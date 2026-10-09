package com.Hypermarketplace.backend.controller;

import com.Hypermarketplace.backend.dto.ProviderRequest;
import com.Hypermarketplace.backend.dto.ProviderResponse;
import com.Hypermarketplace.backend.dto.ScheduleRequest;
import com.Hypermarketplace.backend.dto.ScheduleResponse;
import com.Hypermarketplace.backend.dto.ServiceResponse;
import com.Hypermarketplace.backend.service.ProviderService;
import com.Hypermarketplace.backend.service.ScheduleService;
import com.Hypermarketplace.backend.service.ServiceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/providers")
public class ProviderController {

    private final ProviderService providerService;
    private final ServiceService serviceService;
    private final ScheduleService scheduleService;

    public ProviderController(ProviderService providerService, ServiceService serviceService, ScheduleService scheduleService) {
        this.providerService = providerService;
        this.serviceService = serviceService;
        this.scheduleService = scheduleService;
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

    @GetMapping("/{providerId}/services")
    public ResponseEntity<List<ServiceResponse>> getProviderServices(@PathVariable String providerId) {
        List<ServiceResponse> services = serviceService.getServicesByProviderId(providerId);
        return ResponseEntity.ok(services);
    }

    @PostMapping("/me/schedule")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ScheduleResponse> createOrUpdateSchedule(
            @Valid @RequestBody ScheduleRequest request,
            Authentication authentication) {

        String userId = authentication.getName();
        ScheduleResponse response = scheduleService.createOrUpdateSchedule(userId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{providerId}/schedule")
    public ResponseEntity<List<ScheduleResponse>> getProviderSchedule(@PathVariable String providerId) {
        List<ScheduleResponse> schedules = scheduleService.getProviderSchedule(providerId);
        return ResponseEntity.ok(schedules);
    }

    @PutMapping("/me/schedule/{id}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ScheduleResponse> updateSchedule(
            @PathVariable String id,
            @Valid @RequestBody ScheduleRequest request,
            Authentication authentication) {

        String userId = authentication.getName();
        ScheduleResponse response = scheduleService.updateSchedule(userId, id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/me/schedule/{id}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<Void> deleteSchedule(
            @PathVariable String id,
            Authentication authentication) {

        String userId = authentication.getName();
        scheduleService.deleteSchedule(userId, id);
        return ResponseEntity.noContent().build();
    }
}
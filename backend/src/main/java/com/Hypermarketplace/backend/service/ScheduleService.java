package com.Hypermarketplace.backend.service;

import com.Hypermarketplace.backend.dto.ScheduleRequest;
import com.Hypermarketplace.backend.dto.ScheduleResponse;
import com.Hypermarketplace.backend.exception.ConflictException;
import com.Hypermarketplace.backend.exception.ResourceNotFoundException;
import com.Hypermarketplace.backend.model.Provider;
import com.Hypermarketplace.backend.model.Schedule;
import com.Hypermarketplace.backend.repository.ProviderRepository;
import com.Hypermarketplace.backend.repository.ScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final ProviderRepository providerRepository;

    public ScheduleService(ScheduleRepository scheduleRepository, ProviderRepository providerRepository) {
        this.scheduleRepository = scheduleRepository;
        this.providerRepository = providerRepository;
    }

    public ScheduleResponse createOrUpdateSchedule(String userId, ScheduleRequest request) {
        // Validate time range
        if (request.getStartTime().isAfter(request.getEndTime()) || request.getStartTime().equals(request.getEndTime())) {
            throw new ConflictException("Start time must be before end time");
        }

        // Get the provider profile for the authenticated user
        Provider provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found for this user"));

        // Check if schedule entry already exists for this day (upsert behavior)
        Schedule schedule = scheduleRepository.findByProviderIdAndDayOfWeek(provider.getId(), request.getDayOfWeek())
                .orElse(new Schedule());

        // Update or set the schedule
        schedule.setProviderId(provider.getId());
        schedule.setDayOfWeek(request.getDayOfWeek());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        if (request.getAvailable() != null) {
            schedule.setAvailable(request.getAvailable());
        } else {
            schedule.setAvailable(true);
        }

        Schedule savedSchedule = scheduleRepository.save(schedule);
        return new ScheduleResponse(savedSchedule);
    }

    public List<ScheduleResponse> getProviderSchedule(String providerId) {
        List<Schedule> schedules = scheduleRepository.findByProviderId(providerId);
        return schedules.stream()
                .map(ScheduleResponse::new)
                .collect(Collectors.toList());
    }

    public ScheduleResponse updateSchedule(String userId, String scheduleId, ScheduleRequest request) {
        // Validate time range
        if (request.getStartTime().isAfter(request.getEndTime()) || request.getStartTime().equals(request.getEndTime())) {
            throw new ConflictException("Start time must be before end time");
        }

        // Get the provider profile for the authenticated user
        Provider provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found for this user"));

        Schedule schedule = scheduleRepository.findByIdAndProviderId(scheduleId, provider.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found or you don't have permission to edit it"));

        // Check for duplicate day of week (if changing to a different day)
        if (!schedule.getDayOfWeek().equals(request.getDayOfWeek())) {
            scheduleRepository.findByProviderIdAndDayOfWeek(provider.getId(), request.getDayOfWeek())
                    .ifPresent(existing -> {
                        throw new ConflictException("Schedule entry already exists for " + request.getDayOfWeek());
                    });
        }

        schedule.setDayOfWeek(request.getDayOfWeek());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        if (request.getAvailable() != null) {
            schedule.setAvailable(request.getAvailable());
        }

        Schedule updatedSchedule = scheduleRepository.save(schedule);
        return new ScheduleResponse(updatedSchedule);
    }

    public void deleteSchedule(String userId, String scheduleId) {
        // Get the provider profile for the authenticated user
        Provider provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found for this user"));

        Schedule schedule = scheduleRepository.findByIdAndProviderId(scheduleId, provider.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found or you don't have permission to delete it"));

        scheduleRepository.delete(schedule);
    }
}

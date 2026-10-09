package com.Hypermarketplace.backend.repository;

import com.Hypermarketplace.backend.model.Schedule;
import com.Hypermarketplace.backend.model.WeekDay;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ScheduleRepository extends MongoRepository<Schedule, String> {

    List<Schedule> findByProviderId(String providerId);

    Optional<Schedule> findByProviderIdAndDayOfWeek(String providerId, WeekDay dayOfWeek);

    Optional<Schedule> findByIdAndProviderId(String id, String providerId);
}

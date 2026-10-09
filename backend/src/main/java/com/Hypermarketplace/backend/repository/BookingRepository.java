package com.Hypermarketplace.backend.repository;

import com.Hypermarketplace.backend.model.Booking;
import com.Hypermarketplace.backend.model.BookingStatusEnum;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByCustomerId(String customerId);

    List<Booking> findByProviderId(String providerId);

    List<Booking> findByServiceId(String serviceId);

    Optional<Booking> findByIdAndCustomerId(String id, String customerId);

    Optional<Booking> findByIdAndProviderId(String id, String providerId);
}

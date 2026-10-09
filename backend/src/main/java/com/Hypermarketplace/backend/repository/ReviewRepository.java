package com.Hypermarketplace.backend.repository;

import com.Hypermarketplace.backend.dto.RatingSummaryResponse;
import com.Hypermarketplace.backend.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ReviewRepository extends MongoRepository<Review, String>, ReviewRepositoryCustom {

    boolean existsByBookingId(String bookingId);

    Optional<Review> findByBookingId(String bookingId);

    Page<Review> findByProviderId(String providerId, Pageable pageable);
}

package com.Hypermarketplace.backend.service;

import com.Hypermarketplace.backend.dto.RatingSummaryResponse;
import com.Hypermarketplace.backend.dto.ReviewRequest;
import com.Hypermarketplace.backend.dto.ReviewResponse;
import com.Hypermarketplace.backend.exception.ConflictException;
import com.Hypermarketplace.backend.exception.ResourceNotFoundException;
import com.Hypermarketplace.backend.model.Booking;
import com.Hypermarketplace.backend.model.BookingStatusEnum;
import com.Hypermarketplace.backend.model.Review;
import com.Hypermarketplace.backend.repository.BookingRepository;
import com.Hypermarketplace.backend.repository.ProviderRepository;
import com.Hypermarketplace.backend.repository.ReviewRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final ProviderRepository providerRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         BookingRepository bookingRepository,
                         ProviderRepository providerRepository) {
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
        this.providerRepository = providerRepository;
    }

    public ReviewResponse createReview(String customerId, ReviewRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + request.getBookingId()));

        if (!booking.getCustomerId().equals(customerId)) {
            throw new ResourceNotFoundException("Booking not found or you don't have permission to review it");
        }

        if (booking.getStatus() != BookingStatusEnum.COMPLETED) {
            throw new ConflictException("Reviews can only be submitted for COMPLETED bookings. Current status: " + booking.getStatus());
        }

        if (reviewRepository.existsByBookingId(request.getBookingId())) {
            throw new ConflictException("A review has already been submitted for this booking");
        }

        Review review = new Review(
                customerId,
                booking.getProviderId(),
                booking.getId(),
                request.getRating(),
                request.getComment()
        );

        Review savedReview = reviewRepository.save(review);
        return new ReviewResponse(savedReview);
    }

    public Page<ReviewResponse> getReviewsByProvider(String providerId, Pageable pageable) {
        if (!providerRepository.existsById(providerId)) {
            throw new ResourceNotFoundException("Provider not found with id: " + providerId);
        }

        return reviewRepository.findByProviderId(providerId, pageable)
                .map(ReviewResponse::new);
    }

    public RatingSummaryResponse getRatingSummary(String providerId) {
        if (!providerRepository.existsById(providerId)) {
            throw new ResourceNotFoundException("Provider not found with id: " + providerId);
        }

        return reviewRepository.getRatingSummary(providerId);
    }
}

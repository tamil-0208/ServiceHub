package com.Hypermarketplace.backend.service;

import com.Hypermarketplace.backend.dto.*;
import com.Hypermarketplace.backend.exception.ResourceNotFoundException;
import com.Hypermarketplace.backend.model.*;
import com.Hypermarketplace.backend.repository.*;
import org.bson.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final ReviewRepository reviewRepository;
    private final MongoTemplate mongoTemplate;

    public AdminService(UserRepository userRepository,
                        ProviderRepository providerRepository,
                        BookingRepository bookingRepository,
                        PaymentRepository paymentRepository,
                        ReviewRepository reviewRepository,
                        MongoTemplate mongoTemplate) {
        this.userRepository = userRepository;
        this.providerRepository = providerRepository;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.reviewRepository = reviewRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()
                ));
    }

    public ProviderResponse verifyProvider(String providerId) {
        Provider provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id: " + providerId));

        provider.setVerified(true);
        provider.setRejectionReason(null);
        Provider saved = providerRepository.save(provider);
        return new ProviderResponse(saved);
    }

    public ProviderResponse rejectProvider(String providerId, ProviderRejectRequest request) {
        Provider provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id: " + providerId));

        provider.setVerified(false);
        provider.setRejectionReason(request.getReason());
        Provider saved = providerRepository.save(provider);
        return new ProviderResponse(saved);
    }

    public Page<BookingResponse> getAllBookings(BookingStatusEnum status, Pageable pageable) {
        if (status != null) {
            return bookingRepository.findByStatus(status, pageable)
                    .map(BookingResponse::new);
        }
        return bookingRepository.findAll(pageable)
                .map(BookingResponse::new);
    }

    public Page<PaymentResponse> getAllPayments(PaymentStatusEnum status, Pageable pageable) {
        if (status != null) {
            return paymentRepository.findByStatus(status, pageable)
                    .map(PaymentResponse::new);
        }
        return paymentRepository.findAll(pageable)
                .map(PaymentResponse::new);
    }

    public Page<ReviewResponse> getAllReviews(Pageable pageable) {
        return reviewRepository.findAll(pageable)
                .map(ReviewResponse::new);
    }

    public void deleteReview(String reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));
        reviewRepository.delete(review);
    }

    public AdminAnalyticsSummaryResponse getAnalyticsSummary() {
        long totalUsers = userRepository.count();
        long totalProviders = providerRepository.count();
        long verifiedProviders = providerRepository.countByVerified(true);
        long unverifiedProviders = providerRepository.countByVerified(false);

        Map<String, Long> bookingsByStatus = new HashMap<>();
        for (BookingStatusEnum status : BookingStatusEnum.values()) {
            bookingsByStatus.put(status.name(), bookingRepository.countByStatus(status));
        }

        // Aggregate platformCommission over SUCCESS payments using MongoTemplate aggregation pipeline
        Aggregation revenueAgg = newAggregation(
                match(Criteria.where("status").is(PaymentStatusEnum.SUCCESS)),
                group().sum("platformCommission").as("totalRevenue")
        );

        AggregationResults<Document> results = mongoTemplate.aggregate(revenueAgg, "payments", Document.class);
        Document resultDoc = results.getUniqueMappedResult();

        double totalRevenue = 0.0;
        if (resultDoc != null) {
            Number revNum = (Number) resultDoc.get("totalRevenue");
            if (revNum != null) {
                totalRevenue = Math.round(revNum.doubleValue() * 100.0) / 100.0;
            }
        }

        return new AdminAnalyticsSummaryResponse(
                totalUsers,
                totalProviders,
                verifiedProviders,
                unverifiedProviders,
                bookingsByStatus,
                totalRevenue
        );
    }
}

package com.Hypermarketplace.backend.controller;

import com.Hypermarketplace.backend.dto.ReviewRequest;
import com.Hypermarketplace.backend.dto.ReviewResponse;
import com.Hypermarketplace.backend.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ReviewResponse> createReview(
            @Valid @RequestBody ReviewRequest request,
            Authentication authentication) {

        String customerId = authentication.getName();
        ReviewResponse response = reviewService.createReview(customerId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<Page<ReviewResponse>> getProviderReviews(
            @PathVariable String providerId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<ReviewResponse> reviews = reviewService.getReviewsByProvider(providerId, pageable);
        return ResponseEntity.ok(reviews);
    }
}

package com.Hypermarketplace.backend.controller;

import com.Hypermarketplace.backend.dto.*;
import com.Hypermarketplace.backend.model.BookingStatusEnum;
import com.Hypermarketplace.backend.model.PaymentStatusEnum;
import com.Hypermarketplace.backend.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @PageableDefault(size = 10, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<UserResponse> users = adminService.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }

    @PutMapping("/providers/{id}/verify")
    public ResponseEntity<ProviderResponse> verifyProvider(@PathVariable String id) {
        ProviderResponse response = adminService.verifyProvider(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/providers/{id}/reject")
    public ResponseEntity<ProviderResponse> rejectProvider(
            @PathVariable String id,
            @Valid @RequestBody ProviderRejectRequest request) {
        ProviderResponse response = adminService.rejectProvider(id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/bookings")
    public ResponseEntity<Page<BookingResponse>> getAllBookings(
            @RequestParam(required = false) BookingStatusEnum status,
            @PageableDefault(size = 10, sort = "bookingDate", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<BookingResponse> bookings = adminService.getAllBookings(status, pageable);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/payments")
    public ResponseEntity<Page<PaymentResponse>> getAllPayments(
            @RequestParam(required = false) PaymentStatusEnum status,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<PaymentResponse> payments = adminService.getAllPayments(status, pageable);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/reviews")
    public ResponseEntity<Page<ReviewResponse>> getAllReviews(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ReviewResponse> reviews = adminService.getAllReviews(pageable);
        return ResponseEntity.ok(reviews);
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable String id) {
        adminService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/analytics/summary")
    public ResponseEntity<AdminAnalyticsSummaryResponse> getAnalyticsSummary() {
        AdminAnalyticsSummaryResponse summary = adminService.getAnalyticsSummary();
        return ResponseEntity.ok(summary);
    }
}

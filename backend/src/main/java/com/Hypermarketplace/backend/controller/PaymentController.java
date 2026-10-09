package com.Hypermarketplace.backend.controller;

import com.Hypermarketplace.backend.dto.EarningsResponse;
import com.Hypermarketplace.backend.dto.PaymentResponse;
import com.Hypermarketplace.backend.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/initiate/{bookingId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<PaymentResponse> initiatePayment(
            @PathVariable String bookingId,
            Authentication authentication) {

        String customerId = authentication.getName();
        PaymentResponse response = paymentService.initiatePayment(customerId, bookingId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<PaymentResponse> getPaymentByBooking(
            @PathVariable String bookingId,
            Authentication authentication) {

        String userId = authentication.getName();
        PaymentResponse response = paymentService.getPaymentByBookingId(userId, bookingId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/provider/me/earnings")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<EarningsResponse> getMyEarnings(
            Authentication authentication) {

        String userId = authentication.getName();
        EarningsResponse response = paymentService.getProviderEarnings(userId);
        return ResponseEntity.ok(response);
    }
}

package com.Hypermarketplace.backend.controller;

import com.Hypermarketplace.backend.dto.BookingRequest;
import com.Hypermarketplace.backend.dto.BookingResponse;
import com.Hypermarketplace.backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingRequest request,
            Authentication authentication) {

        String userId = authentication.getName();
        BookingResponse response = bookingService.createBooking(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<BookingResponse>> getMyBookings(Authentication authentication) {
        String userId = authentication.getName();
        List<BookingResponse> bookings = bookingService.getCustomerBookings(userId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/provider/me")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<List<BookingResponse>> getProviderBookings(Authentication authentication) {
        String userId = authentication.getName();
        List<BookingResponse> bookings = bookingService.getProviderBookings(userId);
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/{id}/accept")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<BookingResponse> acceptBooking(
            @PathVariable String id,
            Authentication authentication) {

        String userId = authentication.getName();
        BookingResponse response = bookingService.acceptBooking(userId, id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<BookingResponse> rejectBooking(
            @PathVariable String id,
            Authentication authentication) {

        String userId = authentication.getName();
        BookingResponse response = bookingService.rejectBooking(userId, id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<BookingResponse> completeBooking(
            @PathVariable String id,
            Authentication authentication) {

        String userId = authentication.getName();
        BookingResponse response = bookingService.completeBooking(userId, id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable String id,
            Authentication authentication) {

        String userId = authentication.getName();
        BookingResponse response = bookingService.cancelBooking(userId, id);
        return ResponseEntity.ok(response);
    }
}

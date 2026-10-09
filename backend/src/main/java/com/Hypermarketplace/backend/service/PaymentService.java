package com.Hypermarketplace.backend.service;

import com.Hypermarketplace.backend.config.PaymentConfig;
import com.Hypermarketplace.backend.dto.EarningsResponse;
import com.Hypermarketplace.backend.dto.PaymentResponse;
import com.Hypermarketplace.backend.exception.ConflictException;
import com.Hypermarketplace.backend.exception.ResourceNotFoundException;
import com.Hypermarketplace.backend.model.Booking;
import com.Hypermarketplace.backend.model.BookingStatusEnum;
import com.Hypermarketplace.backend.model.Payment;
import com.Hypermarketplace.backend.model.PaymentMethod;
import com.Hypermarketplace.backend.model.PaymentStatusEnum;
import com.Hypermarketplace.backend.model.Provider;
import com.Hypermarketplace.backend.repository.BookingRepository;
import com.Hypermarketplace.backend.repository.PaymentRepository;
import com.Hypermarketplace.backend.repository.ProviderRepository;
import com.Hypermarketplace.backend.service.payment.PaymentGateway;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final ProviderRepository providerRepository;
    private final PaymentConfig paymentConfig;
    private final PaymentGateway paymentGateway;

    public PaymentService(PaymentRepository paymentRepository,
                          BookingRepository bookingRepository,
                          ProviderRepository providerRepository,
                          PaymentConfig paymentConfig,
                          PaymentGateway paymentGateway) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.providerRepository = providerRepository;
        this.paymentConfig = paymentConfig;
        this.paymentGateway = paymentGateway;
    }

    public PaymentResponse initiatePayment(String customerId, String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!booking.getCustomerId().equals(customerId)) {
            throw new ResourceNotFoundException("Booking not found or you don't have permission to pay for it");
        }

        if (booking.getStatus() != BookingStatusEnum.COMPLETED) {
            throw new ConflictException("Payment can only be initiated for COMPLETED bookings. Current status: " + booking.getStatus());
        }

        Optional<Payment> existingSuccessfulPayment = paymentRepository.findByBookingIdAndStatus(bookingId, PaymentStatusEnum.SUCCESS);
        if (existingSuccessfulPayment.isPresent()) {
            throw new ConflictException("Payment has already been completed for this booking");
        }

        double amount = booking.getPrice();
        double commissionRate = paymentConfig.getCommissionRate();
        double platformCommission = Math.round(amount * commissionRate * 100.0) / 100.0;
        double providerPayout = Math.round((amount - platformCommission) * 100.0) / 100.0;

        Payment payment = new Payment(
                booking.getId(),
                booking.getCustomerId(),
                booking.getProviderId(),
                amount,
                platformCommission,
                providerPayout,
                PaymentMethod.MOCK
        );

        PaymentStatusEnum gatewayResult = paymentGateway.processPayment(amount, PaymentMethod.MOCK);
        payment.setStatus(gatewayResult);

        Payment savedPayment = paymentRepository.save(payment);
        return new PaymentResponse(savedPayment);
    }

    public PaymentResponse getPaymentByBookingId(String userId, String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        boolean isCustomer = booking.getCustomerId().equals(userId);
        boolean isProvider = false;

        Optional<Provider> providerOpt = providerRepository.findByUserId(userId);
        if (providerOpt.isPresent() && providerOpt.get().getId().equals(booking.getProviderId())) {
            isProvider = true;
        }

        if (!isCustomer && !isProvider) {
            throw new ResourceNotFoundException("Booking not found or you don't have permission to view its payment");
        }

        List<Payment> payments = paymentRepository.findByBookingId(bookingId);
        if (payments.isEmpty()) {
            throw new ResourceNotFoundException("No payment found for booking id: " + bookingId);
        }

        // Return latest payment record for this booking
        Payment latestPayment = payments.get(payments.size() - 1);
        return new PaymentResponse(latestPayment);
    }

    public EarningsResponse getProviderEarnings(String userId) {
        Provider provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found for this user"));

        List<Payment> successfulPayments = paymentRepository.findByProviderIdAndStatus(provider.getId(), PaymentStatusEnum.SUCCESS);

        double totalEarnings = successfulPayments.stream()
                .mapToDouble(Payment::getProviderPayout)
                .sum();
        totalEarnings = Math.round(totalEarnings * 100.0) / 100.0;

        return new EarningsResponse(provider.getId(), totalEarnings, successfulPayments.size());
    }
}

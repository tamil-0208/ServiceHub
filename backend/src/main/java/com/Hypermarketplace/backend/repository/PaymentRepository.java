package com.Hypermarketplace.backend.repository;

import com.Hypermarketplace.backend.model.Payment;
import com.Hypermarketplace.backend.model.PaymentStatusEnum;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends MongoRepository<Payment, String> {

    List<Payment> findByBookingId(String bookingId);

    Optional<Payment> findByBookingIdAndStatus(String bookingId, PaymentStatusEnum status);

    List<Payment> findByProviderIdAndStatus(String providerId, PaymentStatusEnum status);

    Optional<Payment> findByIdAndCustomerId(String id, String customerId);

    Optional<Payment> findByIdAndProviderId(String id, String providerId);

    org.springframework.data.domain.Page<Payment> findByStatus(PaymentStatusEnum status, org.springframework.data.domain.Pageable pageable);
}

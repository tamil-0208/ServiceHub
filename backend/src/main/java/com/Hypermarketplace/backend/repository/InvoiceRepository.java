package com.Hypermarketplace.backend.repository;

import com.Hypermarketplace.backend.model.Invoice;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends MongoRepository<Invoice, String> {

    Optional<Invoice> findByBookingId(String bookingId);

    boolean existsByBookingId(String bookingId);

    List<Invoice> findByCustomerId(String customerId, Sort sort);

    List<Invoice> findByProviderId(String providerId, Sort sort);

    long count();
}

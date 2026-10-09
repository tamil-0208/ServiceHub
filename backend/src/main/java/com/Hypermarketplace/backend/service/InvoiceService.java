package com.Hypermarketplace.backend.service;

import com.Hypermarketplace.backend.dto.InvoiceResponse;
import com.Hypermarketplace.backend.exception.ResourceNotFoundException;
import com.Hypermarketplace.backend.model.Booking;
import com.Hypermarketplace.backend.model.Invoice;
import com.Hypermarketplace.backend.model.Payment;
import com.Hypermarketplace.backend.model.Provider;
import com.Hypermarketplace.backend.repository.BookingRepository;
import com.Hypermarketplace.backend.repository.InvoiceRepository;
import com.Hypermarketplace.backend.repository.ProviderRepository;
import com.Hypermarketplace.backend.repository.ServiceRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final BookingRepository bookingRepository;
    private final ProviderRepository providerRepository;
    private final ServiceRepository serviceRepository;

    public InvoiceService(InvoiceRepository invoiceRepository,
                          BookingRepository bookingRepository,
                          ProviderRepository providerRepository,
                          ServiceRepository serviceRepository) {
        this.invoiceRepository = invoiceRepository;
        this.bookingRepository = bookingRepository;
        this.providerRepository = providerRepository;
        this.serviceRepository = serviceRepository;
    }

    public InvoiceResponse generateInvoice(Payment payment) {
        if (invoiceRepository.existsByBookingId(payment.getBookingId())) {
            Invoice existing = invoiceRepository.findByBookingId(payment.getBookingId()).get();
            return new InvoiceResponse(existing);
        }

        String serviceTitle = "Service";
        Optional<Booking> bookingOpt = bookingRepository.findById(payment.getBookingId());
        if (bookingOpt.isPresent() && bookingOpt.get().getServiceId() != null) {
            serviceTitle = serviceRepository.findById(bookingOpt.get().getServiceId())
                    .map(com.Hypermarketplace.backend.model.Service::getTitle)
                    .orElse("Service");
        }

        long count = invoiceRepository.count();
        int currentYear = Year.now().getValue();
        String invoiceNumber = String.format("INV-%d-%06d", currentYear, count + 1);

        Invoice invoice = new Invoice(
                invoiceNumber,
                payment.getBookingId(),
                payment.getCustomerId(),
                payment.getProviderId(),
                serviceTitle,
                payment.getAmount(),
                payment.getPlatformCommission(),
                payment.getProviderPayout()
        );

        Invoice saved = invoiceRepository.save(invoice);
        return new InvoiceResponse(saved);
    }

    public InvoiceResponse getInvoiceByBookingId(String userId, String bookingId) {
        Invoice invoice = invoiceRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found for booking id: " + bookingId));

        boolean isCustomer = invoice.getCustomerId().equals(userId);
        boolean isProvider = false;

        Optional<Provider> providerOpt = providerRepository.findByUserId(userId);
        if (providerOpt.isPresent() && providerOpt.get().getId().equals(invoice.getProviderId())) {
            isProvider = true;
        }

        if (!isCustomer && !isProvider) {
            throw new ResourceNotFoundException("Invoice not found or you don't have permission to view it");
        }

        return new InvoiceResponse(invoice);
    }

    public List<InvoiceResponse> getMyInvoices(String userId) {
        Sort sort = Sort.by(Sort.Direction.DESC, "issuedAt");
        List<Invoice> customerInvoices = invoiceRepository.findByCustomerId(userId, sort);

        Optional<Provider> providerOpt = providerRepository.findByUserId(userId);
        List<Invoice> providerInvoices = new ArrayList<>();
        if (providerOpt.isPresent()) {
            providerInvoices = invoiceRepository.findByProviderId(providerOpt.get().getId(), sort);
        }

        List<Invoice> combined = new ArrayList<>();
        combined.addAll(customerInvoices);
        for (Invoice pi : providerInvoices) {
            if (combined.stream().noneMatch(inv -> inv.getId().equals(pi.getId()))) {
                combined.add(pi);
            }
        }

        combined.sort((a, b) -> b.getIssuedAt().compareTo(a.getIssuedAt()));

        return combined.stream()
                .map(InvoiceResponse::new)
                .collect(Collectors.toList());
    }
}

package com.Hypermarketplace.backend.controller;

import com.Hypermarketplace.backend.dto.InvoiceResponse;
import com.Hypermarketplace.backend.service.InvoiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<InvoiceResponse> getInvoiceByBooking(
            @PathVariable String bookingId,
            Authentication authentication) {

        String userId = authentication.getName();
        InvoiceResponse response = invoiceService.getInvoiceByBookingId(userId, bookingId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<List<InvoiceResponse>> getMyInvoices(Authentication authentication) {
        String userId = authentication.getName();
        List<InvoiceResponse> invoices = invoiceService.getMyInvoices(userId);
        return ResponseEntity.ok(invoices);
    }
}

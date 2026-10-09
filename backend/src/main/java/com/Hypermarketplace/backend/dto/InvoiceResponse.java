package com.Hypermarketplace.backend.dto;

import com.Hypermarketplace.backend.model.Invoice;

import java.time.LocalDateTime;

public class InvoiceResponse {

    private String id;
    private String invoiceNumber;
    private String bookingId;
    private String customerId;
    private String providerId;
    private String serviceTitle;
    private double amount;
    private double platformCommission;
    private double providerPayout;
    private LocalDateTime issuedAt;

    public InvoiceResponse() {
    }

    public InvoiceResponse(Invoice invoice) {
        this.id = invoice.getId();
        this.invoiceNumber = invoice.getInvoiceNumber();
        this.bookingId = invoice.getBookingId();
        this.customerId = invoice.getCustomerId();
        this.providerId = invoice.getProviderId();
        this.serviceTitle = invoice.getServiceTitle();
        this.amount = invoice.getAmount();
        this.platformCommission = invoice.getPlatformCommission();
        this.providerPayout = invoice.getProviderPayout();
        this.issuedAt = invoice.getIssuedAt();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getProviderId() {
        return providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }

    public String getServiceTitle() {
        return serviceTitle;
    }

    public void setServiceTitle(String serviceTitle) {
        this.serviceTitle = serviceTitle;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public double getPlatformCommission() {
        return platformCommission;
    }

    public void setPlatformCommission(double platformCommission) {
        this.platformCommission = platformCommission;
    }

    public double getProviderPayout() {
        return providerPayout;
    }

    public void setProviderPayout(double providerPayout) {
        this.providerPayout = providerPayout;
    }

    public LocalDateTime getIssuedAt() {
        return issuedAt;
    }

    public void setIssuedAt(LocalDateTime issuedAt) {
        this.issuedAt = issuedAt;
    }
}

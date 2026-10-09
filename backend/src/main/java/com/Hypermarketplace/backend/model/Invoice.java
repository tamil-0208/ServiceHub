package com.Hypermarketplace.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "invoices")
public class Invoice {

    @Id
    private String id;

    @Indexed(unique = true)
    private String invoiceNumber;

    @Indexed(unique = true)
    private String bookingId;

    @Indexed
    private String customerId;

    @Indexed
    private String providerId;

    private String serviceTitle;

    private double amount;

    private double platformCommission;

    private double providerPayout;

    private LocalDateTime issuedAt;

    public Invoice() {
        this.issuedAt = LocalDateTime.now();
    }

    public Invoice(String invoiceNumber, String bookingId, String customerId, String providerId,
                   String serviceTitle, double amount, double platformCommission, double providerPayout) {
        this.invoiceNumber = invoiceNumber;
        this.bookingId = bookingId;
        this.customerId = customerId;
        this.providerId = providerId;
        this.serviceTitle = serviceTitle;
        this.amount = amount;
        this.platformCommission = platformCommission;
        this.providerPayout = providerPayout;
        this.issuedAt = LocalDateTime.now();
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

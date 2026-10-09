package com.Hypermarketplace.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "payments")
public class Payment {

    @Id
    private String id;

    private String bookingId;

    private String customerId;

    private String providerId;

    private double amount;

    private double platformCommission;

    private double providerPayout;

    private PaymentStatusEnum status;

    private PaymentMethod method;

    private LocalDateTime createdAt;

    public Payment() {
        this.status = PaymentStatusEnum.PENDING;
        this.method = PaymentMethod.MOCK;
        this.createdAt = LocalDateTime.now();
    }

    public Payment(String bookingId, String customerId, String providerId, double amount,
                  double platformCommission, double providerPayout, PaymentMethod method) {
        this.bookingId = bookingId;
        this.customerId = customerId;
        this.providerId = providerId;
        this.amount = amount;
        this.platformCommission = platformCommission;
        this.providerPayout = providerPayout;
        this.status = PaymentStatusEnum.PENDING;
        this.method = method;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public PaymentStatusEnum getStatus() {
        return status;
    }

    public void setStatus(PaymentStatusEnum status) {
        this.status = status;
    }

    public PaymentMethod getMethod() {
        return method;
    }

    public void setMethod(PaymentMethod method) {
        this.method = method;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

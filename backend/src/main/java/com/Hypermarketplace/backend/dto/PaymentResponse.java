package com.Hypermarketplace.backend.dto;

import com.Hypermarketplace.backend.model.Payment;
import com.Hypermarketplace.backend.model.PaymentMethod;
import com.Hypermarketplace.backend.model.PaymentStatusEnum;

import java.time.LocalDateTime;

public class PaymentResponse {

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

    public PaymentResponse() {
    }

    public PaymentResponse(Payment payment) {
        this.id = payment.getId();
        this.bookingId = payment.getBookingId();
        this.customerId = payment.getCustomerId();
        this.providerId = payment.getProviderId();
        this.amount = payment.getAmount();
        this.platformCommission = payment.getPlatformCommission();
        this.providerPayout = payment.getProviderPayout();
        this.status = payment.getStatus();
        this.method = payment.getMethod();
        this.createdAt = payment.getCreatedAt();
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

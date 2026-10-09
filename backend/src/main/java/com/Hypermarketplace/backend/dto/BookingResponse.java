package com.Hypermarketplace.backend.dto;

import com.Hypermarketplace.backend.model.Booking;

import java.time.format.DateTimeFormatter;

public class BookingResponse {

    private String id;
    private String customerId;
    private String providerId;
    private String serviceId;
    private String addressId;
    private String bookingDate;
    private String bookingTime;
    private String status;
    private double price;
    private String createdAt;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ISO_LOCAL_TIME;
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    public BookingResponse(Booking booking) {
        this.id = booking.getId();
        this.customerId = booking.getCustomerId();
        this.providerId = booking.getProviderId();
        this.serviceId = booking.getServiceId();
        this.addressId = booking.getAddressId();
        this.bookingDate = booking.getBookingDate() != null ? booking.getBookingDate().format(DATE_FORMATTER) : null;
        this.bookingTime = booking.getBookingTime() != null ? booking.getBookingTime().format(TIME_FORMATTER) : null;
        this.status = booking.getStatus() != null ? booking.getStatus().name() : null;
        this.price = booking.getPrice();
        this.createdAt = booking.getCreatedAt() != null ? booking.getCreatedAt().format(DATETIME_FORMATTER) : null;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getServiceId() {
        return serviceId;
    }

    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

    public String getAddressId() {
        return addressId;
    }

    public void setAddressId(String addressId) {
        this.addressId = addressId;
    }

    public String getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(String bookingDate) {
        this.bookingDate = bookingDate;
    }

    public String getBookingTime() {
        return bookingTime;
    }

    public void setBookingTime(String bookingTime) {
        this.bookingTime = bookingTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}

package com.Hypermarketplace.backend.dto;

import java.util.Map;

public class AdminAnalyticsSummaryResponse {

    private long totalUsers;
    private long totalProviders;
    private long verifiedProviders;
    private long unverifiedProviders;
    private Map<String, Long> bookingsByStatus;
    private double totalRevenue;

    public AdminAnalyticsSummaryResponse() {
    }

    public AdminAnalyticsSummaryResponse(long totalUsers, long totalProviders, long verifiedProviders,
                                         long unverifiedProviders, Map<String, Long> bookingsByStatus,
                                         double totalRevenue) {
        this.totalUsers = totalUsers;
        this.totalProviders = totalProviders;
        this.verifiedProviders = verifiedProviders;
        this.unverifiedProviders = unverifiedProviders;
        this.bookingsByStatus = bookingsByStatus;
        this.totalRevenue = totalRevenue;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalProviders() {
        return totalProviders;
    }

    public void setTotalProviders(long totalProviders) {
        this.totalProviders = totalProviders;
    }

    public long getVerifiedProviders() {
        return verifiedProviders;
    }

    public void setVerifiedProviders(long verifiedProviders) {
        this.verifiedProviders = verifiedProviders;
    }

    public long getUnverifiedProviders() {
        return unverifiedProviders;
    }

    public void setUnverifiedProviders(long unverifiedProviders) {
        this.unverifiedProviders = unverifiedProviders;
    }

    public Map<String, Long> getBookingsByStatus() {
        return bookingsByStatus;
    }

    public void setBookingsByStatus(Map<String, Long> bookingsByStatus) {
        this.bookingsByStatus = bookingsByStatus;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}

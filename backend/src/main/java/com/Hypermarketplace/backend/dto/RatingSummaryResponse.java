package com.Hypermarketplace.backend.dto;

public class RatingSummaryResponse {

    private String providerId;
    private double averageRating;
    private long totalReviews;

    public RatingSummaryResponse() {
    }

    public RatingSummaryResponse(String providerId, double averageRating, long totalReviews) {
        this.providerId = providerId;
        this.averageRating = averageRating;
        this.totalReviews = totalReviews;
    }

    public String getProviderId() {
        return providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public long getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(long totalReviews) {
        this.totalReviews = totalReviews;
    }
}

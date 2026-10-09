package com.Hypermarketplace.backend.dto;

public class EarningsResponse {

    private String providerId;
    private double totalEarnings;
    private int completedPaymentsCount;

    public EarningsResponse() {
    }

    public EarningsResponse(String providerId, double totalEarnings, int completedPaymentsCount) {
        this.providerId = providerId;
        this.totalEarnings = totalEarnings;
        this.completedPaymentsCount = completedPaymentsCount;
    }

    public String getProviderId() {
        return providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }

    public double getTotalEarnings() {
        return totalEarnings;
    }

    public void setTotalEarnings(double totalEarnings) {
        this.totalEarnings = totalEarnings;
    }

    public int getCompletedPaymentsCount() {
        return completedPaymentsCount;
    }

    public void setCompletedPaymentsCount(int completedPaymentsCount) {
        this.completedPaymentsCount = completedPaymentsCount;
    }
}

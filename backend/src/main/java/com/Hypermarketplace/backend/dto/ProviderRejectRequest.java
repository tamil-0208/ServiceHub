package com.Hypermarketplace.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class ProviderRejectRequest {

    @NotBlank(message = "Rejection reason is required")
    private String reason;

    public ProviderRejectRequest() {
    }

    public ProviderRejectRequest(String reason) {
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}

package com.Hypermarketplace.backend.dto;

import com.Hypermarketplace.backend.model.Provider;

public class ProviderResponse {

    private String id;
    private String userId;
    private String businessName;
    private String description;
    private String phone;
    private String experience;
    private String address;
    private boolean verified;

    public ProviderResponse(Provider provider) {
        this.id = provider.getId();
        this.userId = provider.getUserId();
        this.businessName = provider.getBusinessName();
        this.description = provider.getDescription();
        this.phone = provider.getPhone();
        this.experience = provider.getExperience();
        this.address = provider.getAddress();
        this.verified = provider.isVerified();
    }

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public String getBusinessName() {
        return businessName;
    }

    public String getDescription() {
        return description;
    }

    public String getPhone() {
        return phone;
    }

    public String getExperience() {
        return experience;
    }

    public String getAddress() {
        return address;
    }

    public boolean isVerified() {
        return verified;
    }
}
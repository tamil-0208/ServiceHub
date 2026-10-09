package com.Hypermarketplace.backend.dto;

import com.Hypermarketplace.backend.model.Service;

public class ServiceResponse {

    private String id;
    private String providerId;
    private String categoryId;
    private String title;
    private String description;
    private double price;
    private Integer durationMinutes;
    private boolean active;

    public ServiceResponse() {
    }

    public ServiceResponse(Service service) {
        this.id = service.getId();
        this.providerId = service.getProviderId();
        this.categoryId = service.getCategoryId();
        this.title = service.getTitle();
        this.description = service.getDescription();
        this.price = service.getPrice();
        this.durationMinutes = service.getDurationMinutes();
        this.active = service.isActive();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProviderId() {
        return providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}

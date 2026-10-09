package com.Hypermarketplace.backend.dto;

import com.Hypermarketplace.backend.model.Schedule;

public class ScheduleResponse {

    private String id;
    private String providerId;
    private String dayOfWeek;
    private String startTime;
    private String endTime;
    private boolean available;

    public ScheduleResponse(Schedule schedule) {
        this.id = schedule.getId();
        this.providerId = schedule.getProviderId();
        this.dayOfWeek = schedule.getDayOfWeek().name();
        this.startTime = schedule.getStartTime().toString();
        this.endTime = schedule.getEndTime().toString();
        this.available = schedule.isAvailable();
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

    public String getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }
}

package com.Hypermarketplace.backend.dto;

import java.time.Instant;

/**
 * Standard error response shape returned by GlobalExceptionHandler for all
 * error cases.  Every field is always present so the frontend can reliably
 * destructure: { status, message, timestamp }.
 */
public class ErrorResponse {

    private int status;
    private String message;
    private String timestamp;

    public ErrorResponse(int status, String message) {
        this.status = status;
        this.message = message;
        this.timestamp = Instant.now().toString();
    }

    public int getStatus() { return status; }
    public String getMessage() { return message; }
    public String getTimestamp() { return timestamp; }
}

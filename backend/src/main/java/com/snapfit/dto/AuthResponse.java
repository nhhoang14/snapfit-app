package com.snapfit.dto;

public class AuthResponse {
    private boolean success;
    private String message;
    private String token;
    private Object data;

    public AuthResponse() {}

    private AuthResponse(boolean success, String message, String token, Object data) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.data = data;
    }

    public static AuthResponse success(String token) {
        return new AuthResponse(true, null, token, null);
    }

    public static AuthResponse success(String message, Object data) {
        return new AuthResponse(true, message, null, data);
    }

    public static AuthResponse error(String message) {
        return new AuthResponse(false, message, null, null);
    }

    // Getters and Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public Object getData() { return data; }
    public void setData(Object data) { this.data = data; }
}

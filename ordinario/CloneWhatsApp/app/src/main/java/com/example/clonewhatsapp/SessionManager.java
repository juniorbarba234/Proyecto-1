package com.example.clonewhatsapp;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONObject;

public class SessionManager {
    private final SharedPreferences preferences;

    public SessionManager(Context context) {
        preferences = context.getSharedPreferences("auth_session", Context.MODE_PRIVATE);
    }

    public void save(JSONObject response, String fallbackEmail) {
        JSONObject user = response.optJSONObject("user");
        String email = user == null ? fallbackEmail : user.optString("email", fallbackEmail);
        long expiresIn = response.optLong("expires_in", 3600);
        preferences.edit()
                .putString("access_token", response.optString("access_token"))
                .putString("refresh_token", response.optString("refresh_token"))
                .putString("email", email)
                .putLong("expires_at", System.currentTimeMillis() + expiresIn * 1000L)
                .apply();
    }

    public boolean isActive() {
        return !getAccessToken().isBlank() && preferences.getLong("expires_at", 0) > System.currentTimeMillis();
    }

    public String getAccessToken() {
        return preferences.getString("access_token", "");
    }

    public String getEmail() {
        return preferences.getString("email", "");
    }

    public void clear() {
        preferences.edit().clear().apply();
    }
}

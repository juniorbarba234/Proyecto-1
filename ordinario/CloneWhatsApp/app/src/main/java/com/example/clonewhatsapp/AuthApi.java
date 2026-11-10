package com.example.clonewhatsapp;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class AuthApi {
    public interface ResultCallback {
        void onSuccess(JSONObject data);
        void onError(String message);
    }

    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");
    private static final OkHttpClient CLIENT = new OkHttpClient();

    public static void registrar(String email, String password, String username, String fullName, ResultCallback callback) {
        try {
            JSONObject metadata = new JSONObject().put("username", username).put("full_name", fullName);
            JSONObject body = new JSONObject().put("email", email).put("password", password).put("data", metadata);
            post("/auth/v1/signup", body, null, callback);
        } catch (JSONException error) {
            callback.onError(error.getMessage());
        }
    }

    public static void iniciarSesion(String email, String password, ResultCallback callback) {
        try {
            JSONObject body = new JSONObject().put("email", email).put("password", password);
            post("/auth/v1/token?grant_type=password", body, null, callback);
        } catch (JSONException error) {
            callback.onError(error.getMessage());
        }
    }

    public static void recuperar(String email, ResultCallback callback) {
        try {
            post("/auth/v1/recover", new JSONObject().put("email", email), null, callback);
        } catch (JSONException error) {
            callback.onError(error.getMessage());
        }
    }

    public static void cerrarSesion(String accessToken, ResultCallback callback) {
        post("/auth/v1/logout", new JSONObject(), accessToken, callback);
    }

    private static void post(String path, JSONObject json, String token, ResultCallback callback) {
        Request request = new Request.Builder()
                .url(BuildConfig.SUPABASE_URL + path)
                .header("apikey", BuildConfig.SUPABASE_ANON_KEY)
                .header("Authorization", "Bearer " + (token == null ? BuildConfig.SUPABASE_ANON_KEY : token))
                .post(RequestBody.create(json.toString(), JSON))
                .build();

        CLIENT.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException error) {
                callback.onError("No se pudo conectar: " + error.getMessage());
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                String content = response.body() == null ? "{}" : response.body().string();
                try {
                    JSONObject data = content.isBlank() ? new JSONObject() : new JSONObject(content);
                    if (response.isSuccessful()) {
                        callback.onSuccess(data);
                    } else {
                        callback.onError(data.optString("msg", data.optString("message", data.optString("error_description", "Error " + response.code()))));
                    }
                } catch (JSONException error) {
                    callback.onError("Respuesta no válida de Supabase.");
                } finally {
                    response.close();
                }
            }
        });
    }
}

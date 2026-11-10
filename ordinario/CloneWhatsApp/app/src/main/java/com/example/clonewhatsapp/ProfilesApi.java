package com.example.clonewhatsapp;

import org.json.JSONArray;
import org.json.JSONException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class ProfilesApi {
    public interface CallbackResultado {
        void correcto(List<Contacto> contactos);
        void error(String mensaje);
    }

    private static final OkHttpClient CLIENT = new OkHttpClient();

    public static void consultar(String token, CallbackResultado callback) {
        Request request = new Request.Builder()
                .url(BuildConfig.SUPABASE_URL + "/rest/v1/profiles?select=id,username,full_name,avatar_url&order=full_name.asc")
                .header("apikey", BuildConfig.SUPABASE_ANON_KEY)
                .header("Authorization", "Bearer " + token)
                .get().build();
        CLIENT.newCall(request).enqueue(new Callback() {
            @Override public void onFailure(Call call, IOException error) { callback.error(error.getMessage()); }

            @Override public void onResponse(Call call, Response response) throws IOException {
                String contenido = response.body() == null ? "[]" : response.body().string();
                try {
                    if (!response.isSuccessful()) {
                        callback.error("Supabase respondió " + response.code());
                        return;
                    }
                    JSONArray datos = new JSONArray(contenido);
                    List<Contacto> contactos = new ArrayList<>();
                    for (int i = 0; i < datos.length(); i++) {
                        String usuario = datos.getJSONObject(i).optString("username", "usuario");
                        String nombre = datos.getJSONObject(i).optString("full_name", usuario);
                        if (nombre.isBlank() || nombre.equals("null")) nombre = usuario;
                        contactos.add(new Contacto(datos.getJSONObject(i).optString("id"), nombre, usuario,
                                datos.getJSONObject(i).optString("avatar_url")));
                    }
                    callback.correcto(contactos);
                } catch (JSONException error) {
                    callback.error("Respuesta no válida de Supabase");
                } finally { response.close(); }
            }
        });
    }
}

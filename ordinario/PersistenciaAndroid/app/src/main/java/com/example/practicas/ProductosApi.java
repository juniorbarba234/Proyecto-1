package com.example.practicas;

import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.io.*;

public class ProductosApi {
    public static String solicitar(String base, String clave, String metodo, String filtro, String datos) throws Exception {
        URL url = new URL(base + "/rest/v1/productos" + filtro);
        if (!url.getProtocol().equals("https")) throw new IOException("Usa la URL HTTPS de Supabase");
        HttpURLConnection conexion = (HttpURLConnection) url.openConnection();
        try {
            conexion.setConnectTimeout(10000);
            conexion.setReadTimeout(10000);
            conexion.setRequestMethod(metodo);
            conexion.setRequestProperty("apikey", clave);
            if (clave.startsWith("eyJ")) conexion.setRequestProperty("Authorization", "Bearer " + clave);
            conexion.setRequestProperty("Content-Type", "application/json");
            conexion.setRequestProperty("Prefer", "return=representation");
            if (datos != null) {
                conexion.setDoOutput(true);
                try (OutputStream salida = conexion.getOutputStream()) { salida.write(datos.getBytes(StandardCharsets.UTF_8)); }
            }
            int estado = conexion.getResponseCode();
            InputStream entrada = estado < 400 ? conexion.getInputStream() : conexion.getErrorStream();
            StringBuilder texto = new StringBuilder();
            if (entrada != null) try (BufferedReader lector = new BufferedReader(new InputStreamReader(entrada, StandardCharsets.UTF_8))) {
                String linea;
                while ((linea = lector.readLine()) != null) texto.append(linea);
            }
            if (estado >= 400) throw new IOException("Supabase respondió " + estado + ": " + texto);
            return texto.toString();
        } finally { conexion.disconnect(); }
    }
}

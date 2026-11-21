package com.example.practicas;

import android.os.Bundle;
import android.content.SharedPreferences;
import android.text.InputType;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AlertDialog;
import org.json.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ExecutorService;

public class MainActivity extends AppCompatActivity {
    private EditText nombre, descripcion, precio;
    private TextView estado;
    private LinearLayout lista;
    private long seleccionado = -1;
    private SharedPreferences ajustes;
    private final ExecutorService tareas = Executors.newSingleThreadExecutor();

    @Override public void onCreate(Bundle guardado) {
        super.onCreate(guardado);
        setTitle("Mis productos");
        ajustes = getSharedPreferences("supabase", MODE_PRIVATE);
        LinearLayout panel = new LinearLayout(this);
        panel.setOrientation(LinearLayout.VERTICAL);
        panel.setPadding(24, 24, 24, 24);
        ScrollView scroll = new ScrollView(this);
        scroll.addView(panel);
        setContentView(scroll);
        boton(panel, "Configurar conexión", this::configurar);
        nombre = campo(panel, "Producto");
        descripcion = campo(panel, "Descripción");
        precio = campo(panel, "Precio");
        precio.setInputType(InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_FLAG_DECIMAL);
        boton(panel, "Crear producto", () -> guardar(false));
        boton(panel, "Actualizar seleccionado", () -> guardar(true));
        boton(panel, "Eliminar seleccionado", this::eliminar);
        boton(panel, "Consultar productos", this::consultar);
        estado = new TextView(this);
        estado.setText("Configura Supabase y consulta tus productos. Toca un producto para seleccionarlo.");
        panel.addView(estado);
        lista = new LinearLayout(this);
        lista.setOrientation(LinearLayout.VERTICAL);
        panel.addView(lista);
        if (!ajustes.getString("url", "").isEmpty()) consultar();
    }
    private EditText campo(LinearLayout panel, String pista) {
        EditText entrada = new EditText(this);
        entrada.setHint(pista);
        panel.addView(entrada);
        return entrada;
    }
    private void boton(LinearLayout panel, String titulo, Runnable accion) {
        Button boton = new Button(this);
        boton.setText(titulo);
        boton.setOnClickListener(v -> accion.run());
        panel.addView(boton);
    }
    private void configurar() {
        LinearLayout panel = new LinearLayout(this);
        panel.setOrientation(LinearLayout.VERTICAL);
        EditText url = campo(panel, "URL de Supabase (https://...supabase.co)");
        EditText clave = campo(panel, "Clave pública anon o publishable");
        url.setText(ajustes.getString("url", ""));
        clave.setText(ajustes.getString("clave", ""));
        new AlertDialog.Builder(this).setTitle("Conexión a tu proyecto").setView(panel)
                .setNegativeButton("Cancelar", null).setPositiveButton("Guardar", (d, w) -> {
                    String base = url.getText().toString().trim().replaceAll("/+$", "");
                    if (!base.startsWith("https://") || clave.getText().toString().trim().isEmpty()) {
                        estado.setText("Escribe una URL HTTPS y la clave pública"); return;
                    }
                    ajustes.edit().putString("url", base).putString("clave", clave.getText().toString().trim()).apply();
                    consultar();
                }).show();
    }
    private void consultar() { ejecutar("GET", "?select=*&order=id.desc", null, false); }
    private void guardar(boolean actualizar) {
        if (actualizar && seleccionado < 0) { estado.setText("Primero selecciona un producto"); return; }
        try {
            double valor = Double.parseDouble(precio.getText().toString().replace(',', '.'));
            if (nombre.getText().toString().trim().isEmpty() || descripcion.getText().toString().trim().isEmpty() || !Double.isFinite(valor) || valor < 0) throw new IllegalArgumentException();
            JSONObject datos = new JSONObject().put("producto", nombre.getText().toString().trim())
                    .put("descripcion", descripcion.getText().toString().trim()).put("precio", valor);
            ejecutar(actualizar ? "PATCH" : "POST", actualizar ? "?id=eq." + seleccionado : "", datos.toString(), true);
        } catch (Exception error) { estado.setText("Completa los campos con un precio válido, mayor o igual a cero"); }
    }
    private void eliminar() {
        if (seleccionado < 0) { estado.setText("Primero selecciona un producto"); return; }
        new AlertDialog.Builder(this).setMessage("¿Eliminar este producto?")
                .setNegativeButton("Cancelar", null).setPositiveButton("Eliminar", (d, w) ->
                        ejecutar("DELETE", "?id=eq." + seleccionado, null, true)).show();
    }
    private void ejecutar(String metodo, String filtro, String datos, boolean cambio) {
        String url = ajustes.getString("url", ""), clave = ajustes.getString("clave", "");
        if (url.isEmpty() || clave.isEmpty()) { estado.setText("Primero configura la conexión"); return; }
        estado.setText("Conectando...");
        tareas.execute(() -> {
            try {
                JSONArray respuesta = new JSONArray(ProductosApi.solicitar(url, clave, metodo, filtro, datos));
                if (cambio && respuesta.length() == 0) throw new Exception("No se modificó ningún registro. Revisa permisos o vuelve a consultar.");
                runOnUiThread(() -> {
                    if (isDestroyed()) return;
                    if (cambio) {
                        seleccionado = -1;
                        nombre.setText(""); descripcion.setText(""); precio.setText("");
                        consultar();
                    } else mostrar(respuesta);
                });
            } catch (Exception error) {
                runOnUiThread(() -> { if (!isDestroyed()) estado.setText(error.getMessage()); });
            }
        });
    }
    private void mostrar(JSONArray productos) {
        lista.removeAllViews();
        estado.setText(productos.length() + " productos. Toca uno para editarlo.");
        for (int i = 0; i < productos.length(); i++) {
            JSONObject producto = productos.optJSONObject(i);
            if (producto == null) continue;
            boton(lista, producto.optString("producto") + " · $" + producto.optString("precio"), () -> {
                seleccionado = producto.optLong("id", -1);
                nombre.setText(producto.optString("producto"));
                descripcion.setText(producto.optString("descripcion"));
                precio.setText(producto.optString("precio"));
                estado.setText("Seleccionado: " + producto.optString("producto"));
            });
        }
    }
    @Override protected void onDestroy() { tareas.shutdown(); super.onDestroy(); }
}

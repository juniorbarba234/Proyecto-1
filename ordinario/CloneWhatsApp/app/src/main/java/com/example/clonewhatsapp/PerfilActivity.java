package com.example.clonewhatsapp;

import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

public class PerfilActivity extends AppCompatActivity {
    private static final int ELEGIR_FOTO = 20;
    private ImageView imagen;
    private EditText nombre, usuario;
    private TextView resultado;
    private SharedPreferences datos;
    private String fotoUri = "";

    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_perfil);
        setTitle(R.string.mi_perfil);
        imagen = findViewById(R.id.imgPerfil);
        nombre = findViewById(R.id.edtNombrePerfil);
        usuario = findViewById(R.id.edtUsuarioPerfil);
        resultado = findViewById(R.id.txtPerfilResultado);
        datos = getSharedPreferences("perfil_demo", MODE_PRIVATE);
        nombre.setText(datos.getString("nombre", "Junior Barba"));
        usuario.setText(datos.getString("usuario", "junior"));
        fotoUri = datos.getString("foto", "");
        mostrarFoto();
        findViewById(R.id.btnFoto).setOnClickListener(v -> elegirFoto());
        findViewById(R.id.btnGuardarPerfil).setOnClickListener(v -> guardar());
    }

    private void elegirFoto() {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT).setType("image/*").addCategory(Intent.CATEGORY_OPENABLE);
        startActivityForResult(intent, ELEGIR_FOTO);
    }

    @Override protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == ELEGIR_FOTO && resultCode == RESULT_OK && data != null && data.getData() != null) {
            Uri uri = data.getData();
            getContentResolver().takePersistableUriPermission(uri, Intent.FLAG_GRANT_READ_URI_PERMISSION);
            fotoUri = uri.toString();
            mostrarFoto();
        }
    }

    private void mostrarFoto() {
        if (!fotoUri.isBlank()) imagen.setImageURI(Uri.parse(fotoUri));
    }

    private void guardar() {
        if (nombre.getText().toString().trim().isEmpty() || usuario.getText().toString().trim().isEmpty()) {
            resultado.setText("Escribe el nombre y el usuario.");
            return;
        }
        datos.edit().putString("nombre", nombre.getText().toString().trim())
                .putString("usuario", usuario.getText().toString().trim()).putString("foto", fotoUri).apply();
        resultado.setText(R.string.perfil_guardado);
    }
}

package com.example.clonewhatsapp;

import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONObject;

public class RegistroActivity extends AppCompatActivity {
    private EditText edtUsuario;
    private EditText edtCorreo;
    private EditText edtPassword;
    private TextView txtResultado;
    private Button btnRegistrar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_registro);
        setTitle(R.string.registro);

        edtUsuario = findViewById(R.id.edtUsuario);
        edtCorreo = findViewById(R.id.edtCorreo);
        edtPassword = findViewById(R.id.edtPassword);
        txtResultado = findViewById(R.id.txtResultado);
        btnRegistrar = findViewById(R.id.btnRegistrar);
        btnRegistrar.setOnClickListener(view -> registrar());
    }

    private void registrar() {
        String usuario = edtUsuario.getText().toString().trim();
        String correo = edtCorreo.getText().toString().trim();
        String password = edtPassword.getText().toString();
        if (usuario.isEmpty() || correo.isEmpty() || password.length() < 6) {
            txtResultado.setText(R.string.datos_invalidos);
            return;
        }
        activar(false, getString(R.string.procesando));
        AuthApi.registrar(correo, password, usuario, usuario, new AuthApi.ResultCallback() {
            @Override
            public void onSuccess(JSONObject data) {
                runOnUiThread(() -> activar(true, getString(R.string.registro_correcto)));
            }

            @Override
            public void onError(String message) {
                runOnUiThread(() -> activar(true, message));
            }
        });
    }

    private void activar(boolean enabled, String message) {
        btnRegistrar.setEnabled(enabled);
        txtResultado.setText(message);
    }
}

package com.example.clonewhatsapp;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONObject;

public class LoginActivity extends AppCompatActivity {
    private EditText edtCorreo;
    private EditText edtPassword;
    private TextView txtResultado;
    private Button btnLogin;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        setTitle(R.string.iniciar_sesion);

        edtCorreo = findViewById(R.id.edtCorreo);
        edtPassword = findViewById(R.id.edtPassword);
        txtResultado = findViewById(R.id.txtResultado);
        btnLogin = findViewById(R.id.btnLogin);
        btnLogin.setOnClickListener(view -> iniciarSesion());
    }

    private void iniciarSesion() {
        String correo = edtCorreo.getText().toString().trim();
        String password = edtPassword.getText().toString();
        if (correo.isEmpty() || password.isEmpty()) {
            txtResultado.setText(R.string.datos_invalidos);
            return;
        }
        activar(false, getString(R.string.procesando));
        AuthApi.iniciarSesion(correo, password, new AuthApi.ResultCallback() {
            @Override
            public void onSuccess(JSONObject data) {
                new SessionManager(LoginActivity.this).save(data, correo);
                runOnUiThread(() -> {
                    startActivity(new Intent(LoginActivity.this, SesionActivity.class));
                    finish();
                });
            }

            @Override
            public void onError(String message) {
                runOnUiThread(() -> activar(true, message));
            }
        });
    }

    private void activar(boolean enabled, String message) {
        btnLogin.setEnabled(enabled);
        txtResultado.setText(message);
    }
}

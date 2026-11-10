package com.example.clonewhatsapp;

import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONObject;

public class SesionActivity extends AppCompatActivity {
    private SessionManager session;
    private TextView txtSesion;
    private Button btnCerrar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sesion);
        setTitle(R.string.sesion);

        session = new SessionManager(this);
        txtSesion = findViewById(R.id.txtSesion);
        btnCerrar = findViewById(R.id.btnCerrarSesion);

        if (!session.isActive()) {
            txtSesion.setText(R.string.sesion_expirada);
            btnCerrar.setEnabled(false);
            return;
        }

        txtSesion.setText(getString(R.string.sesion_activa, session.getEmail()));
        btnCerrar.setOnClickListener(view -> cerrarSesion());
    }

    private void cerrarSesion() {
        btnCerrar.setEnabled(false);
        AuthApi.cerrarSesion(session.getAccessToken(), new AuthApi.ResultCallback() {
            @Override
            public void onSuccess(JSONObject data) {
                finalizar();
            }

            @Override
            public void onError(String message) {
                finalizar();
            }
        });
    }

    private void finalizar() {
        session.clear();
        runOnUiThread(this::finish);
    }
}

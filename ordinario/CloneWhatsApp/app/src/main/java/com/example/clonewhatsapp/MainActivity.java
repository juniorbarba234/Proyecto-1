package com.example.clonewhatsapp;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private TextView txtSesion;
    private Button btnSesion;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        txtSesion = findViewById(R.id.txtSesion);
        btnSesion = findViewById(R.id.btnSesion);

        findViewById(R.id.btnRegistro).setOnClickListener(view -> abrir(RegistroActivity.class));
        findViewById(R.id.btnLogin).setOnClickListener(view -> abrir(LoginActivity.class));
        findViewById(R.id.btnRecuperar).setOnClickListener(view -> abrir(RecuperarActivity.class));
        findViewById(R.id.btnPerfil).setOnClickListener(view -> abrir(PerfilActivity.class));
        findViewById(R.id.btnContactos).setOnClickListener(view -> abrir(ContactosActivity.class));
        btnSesion.setOnClickListener(view -> abrir(SesionActivity.class));
    }

    @Override
    protected void onResume() {
        super.onResume();
        SessionManager session = new SessionManager(this);
        boolean activa = session.isActive();
        txtSesion.setText(activa ? getString(R.string.sesion_activa, session.getEmail()) : getString(R.string.sin_sesion));
        btnSesion.setEnabled(activa);
    }

    private void abrir(Class<?> activityClass) {
        startActivity(new Intent(this, activityClass));
    }
}

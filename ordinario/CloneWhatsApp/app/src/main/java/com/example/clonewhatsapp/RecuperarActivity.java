package com.example.clonewhatsapp;

import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONObject;

public class RecuperarActivity extends AppCompatActivity {
    private EditText edtCorreo;
    private TextView txtResultado;
    private Button btnEnviar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_recuperar);
        setTitle(R.string.recuperar_password);

        edtCorreo = findViewById(R.id.edtCorreo);
        txtResultado = findViewById(R.id.txtResultado);
        btnEnviar = findViewById(R.id.btnEnviar);
        btnEnviar.setOnClickListener(view -> recuperar());
    }

    private void recuperar() {
        String correo = edtCorreo.getText().toString().trim();
        if (correo.isEmpty()) {
            txtResultado.setText(R.string.datos_invalidos);
            return;
        }
        btnEnviar.setEnabled(false);
        txtResultado.setText(R.string.procesando);
        AuthApi.recuperar(correo, new AuthApi.ResultCallback() {
            @Override
            public void onSuccess(JSONObject data) {
                runOnUiThread(() -> {
                    btnEnviar.setEnabled(true);
                    txtResultado.setText(R.string.correo_recuperacion_enviado);
                });
            }

            @Override
            public void onError(String message) {
                runOnUiThread(() -> {
                    btnEnviar.setEnabled(true);
                    txtResultado.setText(message);
                });
            }
        });
    }
}

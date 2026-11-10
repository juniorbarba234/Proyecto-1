package com.example.verticalhorizontal;

import android.content.res.Configuration;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private static final String CLAVE_RESULTADO = "resultado";
    private static final String CLAVE_VECES = "veces";
    private TextView resultado;
    private TextView indicador;
    private int vecesMostrado;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        EditText entrada = findViewById(R.id.entradaTexto);
        Button mostrar = findViewById(R.id.botonMostrar);
        resultado = findViewById(R.id.textoResultado);
        indicador = findViewById(R.id.textoOrientacion);

        if (savedInstanceState != null) {
            resultado.setText(savedInstanceState.getString(CLAVE_RESULTADO, "Tu mensaje aparecerá aquí"));
            vecesMostrado = savedInstanceState.getInt(CLAVE_VECES, 0);
        }

        actualizarOrientacion();

        mostrar.setOnClickListener(v -> {
            String texto = entrada.getText().toString().trim();
            if (texto.isEmpty()) {
                entrada.setError("Escribe un mensaje");
            } else {
                vecesMostrado++;
                resultado.setText(texto);
                actualizarOrientacion();
            }
        });
    }

    private void actualizarOrientacion() {
        boolean horizontal = getResources().getConfiguration().orientation == Configuration.ORIENTATION_LANDSCAPE;
        String orientacion = horizontal ? "Horizontal" : "Vertical";
        indicador.setText(orientacion + " · Mensajes mostrados: " + vecesMostrado);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        outState.putString(CLAVE_RESULTADO, resultado.getText().toString());
        outState.putInt(CLAVE_VECES, vecesMostrado);
        super.onSaveInstanceState(outState);
    }
}


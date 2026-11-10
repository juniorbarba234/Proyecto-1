package com.example.calculadorasumas;

import android.os.Bundle;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;

import java.text.DecimalFormat;

public class MainActivity extends AppCompatActivity {
    private TextInputEditText primerNumero;
    private TextInputEditText segundoNumero;
    private TextView resultado;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        primerNumero = findViewById(R.id.edtPrimerNumero);
        segundoNumero = findViewById(R.id.edtSegundoNumero);
        resultado = findViewById(R.id.txtResultado);
        MaterialButton sumar = findViewById(R.id.btnSumar);
        MaterialButton limpiar = findViewById(R.id.btnLimpiar);

        sumar.setOnClickListener(view -> calcularSuma());
        limpiar.setOnClickListener(view -> limpiarCampos());
    }

    private void calcularSuma() {
        String primero = textoDe(primerNumero);
        String segundo = textoDe(segundoNumero);
        if (primero.isEmpty() || segundo.isEmpty()) {
            resultado.setText(R.string.faltan_numeros);
            return;
        }

        try {
            double total = Double.parseDouble(primero) + Double.parseDouble(segundo);
            String cantidad = new DecimalFormat("0.##").format(total);
            resultado.setText(getString(R.string.resultado, cantidad));
        } catch (NumberFormatException error) {
            resultado.setText(R.string.numero_invalido);
        }
    }

    private String textoDe(TextInputEditText campo) {
        return campo.getText() == null ? "" : campo.getText().toString().trim();
    }

    private void limpiarCampos() {
        primerNumero.setText("");
        segundoNumero.setText("");
        resultado.setText(R.string.resultado_inicial);
        primerNumero.requestFocus();
    }
}

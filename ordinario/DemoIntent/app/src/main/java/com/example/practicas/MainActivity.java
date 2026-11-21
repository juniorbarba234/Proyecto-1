package com.example.practicas;

import android.content.Intent;
import android.os.Bundle;
import android.text.InputType;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    @Override public void onCreate(Bundle estado) {
        super.onCreate(estado);
        setTitle("Planear un viaje");
        LinearLayout panel = new LinearLayout(this);
        panel.setOrientation(LinearLayout.VERTICAL);
        int margen = (int) (16 * getResources().getDisplayMetrics().density);
        panel.setPadding(margen, margen, margen, margen);
        ScrollView scroll = new ScrollView(this);
        scroll.addView(panel);
        setContentView(scroll);
        androidx.core.view.ViewCompat.setOnApplyWindowInsetsListener(scroll, (vista, insets) -> {
            androidx.core.graphics.Insets barras = insets.getInsets(
                    androidx.core.view.WindowInsetsCompat.Type.systemBars()
                            | androidx.core.view.WindowInsetsCompat.Type.displayCutout()
                            | androidx.core.view.WindowInsetsCompat.Type.ime());
            vista.setPadding(barras.left, barras.top, barras.right, barras.bottom);
            return insets;
        });
        TextView titulo = new TextView(this);
        titulo.setText("Planear un viaje");
        titulo.setTextSize(26);
        panel.addView(titulo);
        EditText destino = campo(panel, "Destino", InputType.TYPE_CLASS_TEXT, 1);
        EditText personas = campo(panel, "Personas", InputType.TYPE_CLASS_NUMBER, 2);
        EditText precio = campo(panel, "Precio por persona", InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_FLAG_DECIMAL, 3);
        Button continuar = new Button(this);
        continuar.setText("Ver resumen del viaje");
        panel.addView(continuar);
        continuar.setOnClickListener(v -> {
            try {
                int cantidad = Integer.parseInt(personas.getText().toString());
                double costo = Double.parseDouble(precio.getText().toString().replace(',', '.'));
                if (destino.getText().toString().trim().isEmpty() || cantidad < 1 || !Double.isFinite(costo) || costo < 0 || !Double.isFinite(costo * cantidad)) {
                    throw new IllegalArgumentException();
                }
                Intent resumen = new Intent(this, ResumenActivity.class);
                resumen.putExtra("destino", destino.getText().toString().trim());
                resumen.putExtra("personas", cantidad);
                resumen.putExtra("precio", costo);
                startActivity(resumen);
            } catch (IllegalArgumentException error) {
                Toast.makeText(this, "Escribe un destino, personas mayores a cero y un precio válido", Toast.LENGTH_LONG).show();
            }
        });
    }
    private EditText campo(LinearLayout panel, String pista, int tipo, int id) {
        EditText campo = new EditText(this);
        campo.setId(id);
        campo.setHint(pista);
        campo.setInputType(tipo);
        panel.addView(campo);
        return campo;
    }
}

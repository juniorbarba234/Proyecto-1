package com.example.practicas;

import android.os.Bundle;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;
import java.util.Locale;

public class ResumenActivity extends AppCompatActivity {
    @Override public void onCreate(Bundle estado) {
        super.onCreate(estado);
        setTitle("Resumen");
        String destino = getIntent().getStringExtra("destino");
        int personas = getIntent().getIntExtra("personas", 1);
        double precio = getIntent().getDoubleExtra("precio", 0);
        LinearLayout panel = new LinearLayout(this);
        int margen = (int) (16 * getResources().getDisplayMetrics().density);
        panel.setPadding(margen, margen, margen, margen);
        panel.setOrientation(LinearLayout.VERTICAL);
        ScrollView scroll = new ScrollView(this);
        scroll.addView(panel);
        setContentView(scroll);
        androidx.core.view.ViewCompat.setOnApplyWindowInsetsListener(scroll, (vista, insets) -> {
            androidx.core.graphics.Insets barras = insets.getInsets(
                    androidx.core.view.WindowInsetsCompat.Type.systemBars()
                            | androidx.core.view.WindowInsetsCompat.Type.displayCutout());
            vista.setPadding(barras.left, barras.top, barras.right, barras.bottom);
            return insets;
        });
        TextView titulo = new TextView(this);
        titulo.setText("Resumen del viaje");
        titulo.setTextSize(26);
        panel.addView(titulo);
        TextView resumen = new TextView(this);
        resumen.setTextSize(22);
        resumen.setText(String.format(Locale.getDefault(), "Destino: %s\nPersonas: %d\nPor persona: $%.2f\nTotal: $%.2f", destino, personas, precio, personas * precio));
        panel.addView(resumen);
        Button volver = new Button(this);
        volver.setText("Cambiar los datos");
        volver.setOnClickListener(v -> finish());
        panel.addView(volver);
    }
}

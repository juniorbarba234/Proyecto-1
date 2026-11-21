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
        panel.setPadding(24, 24, 24, 24);
        panel.setOrientation(LinearLayout.VERTICAL);
        setContentView(panel);
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

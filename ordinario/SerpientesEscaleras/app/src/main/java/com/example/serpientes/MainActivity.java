package com.example.serpientes;

import android.os.Bundle;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AlertDialog;
import java.util.Random;

public class MainActivity extends AppCompatActivity {
    private final Partida partida = new Partida();
    private final Random azar = new Random();
    private TextView estado, mensaje;
    private Button dado;
    private TableroView tablero;

    @Override public void onCreate(Bundle guardado) {
        super.onCreate(guardado);
        setTitle("Serpientes y escaleras");
        LinearLayout panel = new LinearLayout(this);
        panel.setOrientation(LinearLayout.VERTICAL);
        int margen = (int) (12 * getResources().getDisplayMetrics().density);
        panel.setPadding(margen, margen, margen, margen);
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
        titulo.setText("Serpientes y escaleras");
        titulo.setTextSize(24);
        titulo.setTypeface(null, android.graphics.Typeface.BOLD);
        panel.addView(titulo);
        estado = new TextView(this);
        estado.setTextSize(18);
        panel.addView(estado);
        TextView reglas = new TextView(this);
        reglas.setText("Dos jugadores en el mismo teléfono. Verde: subes. Rojo: bajas. Se gana llegando exactamente a 100. Las fichas empiezan fuera del tablero, en 0.");
        panel.addView(reglas);
        tablero = new TableroView(this, partida);
        panel.addView(tablero);
        mensaje = new TextView(this);
        mensaje.setTextSize(17);
        mensaje.setAccessibilityLiveRegion(android.view.View.ACCESSIBILITY_LIVE_REGION_POLITE);
        mensaje.setText("Comienza el jugador 1 (azul).");
        panel.addView(mensaje);
        dado = new Button(this);
        dado.setText("Lanzar dado");
        dado.setOnClickListener(v -> { mensaje.setText(partida.lanzar(azar.nextInt(6) + 1)); actualizar(); });
        panel.addView(dado);
        Button reiniciar = new Button(this);
        reiniciar.setText("Nueva partida");
        reiniciar.setOnClickListener(v -> new AlertDialog.Builder(this).setMessage("¿Empezar una nueva partida?")
                .setNegativeButton("Continuar jugando", null).setPositiveButton("Reiniciar", (d, w) -> {
                    partida.reiniciar(); mensaje.setText("Comienza el jugador 1 (azul)."); actualizar();
                }).show());
        panel.addView(reiniciar);
        if (guardado != null) {
            partida.restaurar(guardado.getIntArray("partida"));
            mensaje.setText(guardado.getString("mensaje", "Continúa la partida"));
        }
        actualizar();
    }
    private void actualizar() {
        String turno = partida.ganador() >= 0 ? "Ganó el jugador " + (partida.ganador() + 1) : "Turno: jugador " + (partida.turno() + 1);
        estado.setText(turno + "\nAzul (J1): " + partida.posicion(0) + " · Naranja (J2): " + partida.posicion(1));
        dado.setEnabled(partida.ganador() < 0);
        tablero.setContentDescription("Tablero de 100 casillas. Jugador 1 en " + partida.posicion(0) + ", jugador 2 en " + partida.posicion(1));
        tablero.invalidate();
    }
    @Override protected void onSaveInstanceState(Bundle guardado) {
        guardado.putIntArray("partida", partida.guardar());
        guardado.putString("mensaje", mensaje.getText().toString());
        super.onSaveInstanceState(guardado);
    }
}

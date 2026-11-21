package com.example.practicas;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;
import java.util.*;

public class MainActivity extends AppCompatActivity {
    private final String[] figuras = {"●", "▲", "■", "★"};
    private int[] cartas;
    private boolean[] encontradas;
    private final Button[] botones = new Button[8];
    private TextView marcador;
    private int primera = -1, segunda = -1, intentos, parejas;
    private final Handler reloj = new Handler(Looper.getMainLooper());
    private final Runnable ocultar = () -> { primera = -1; segunda = -1; dibujar(); };

    @Override public void onCreate(Bundle estado) {
        super.onCreate(estado);
        setTitle("Memorama de figuras");
        LinearLayout panel = new LinearLayout(this);
        panel.setOrientation(LinearLayout.VERTICAL);
        panel.setPadding(24, 24, 24, 24);
        ScrollView scroll = new ScrollView(this);
        scroll.addView(panel);
        setContentView(scroll);
        TextView instrucciones = new TextView(this);
        instrucciones.setText("Toca dos cartas. Encuentra las cuatro parejas con el menor número de intentos.");
        panel.addView(instrucciones);
        marcador = new TextView(this);
        marcador.setTextSize(20);
        panel.addView(marcador);
        for (int fila = 0; fila < 4; fila++) {
            LinearLayout renglon = new LinearLayout(this);
            panel.addView(renglon);
            for (int columna = 0; columna < 2; columna++) {
                int posicion = fila * 2 + columna;
                Button carta = new Button(this);
                carta.setTextSize(30);
                carta.setOnClickListener(v -> elegir(posicion));
                renglon.addView(carta, new LinearLayout.LayoutParams(0, 135, 1));
                botones[posicion] = carta;
            }
        }
        Button reiniciar = new Button(this);
        reiniciar.setText("Nueva partida");
        reiniciar.setOnClickListener(v -> nuevaPartida());
        panel.addView(reiniciar);
        if (estado == null) nuevaPartida();
        else {
            cartas = estado.getIntArray("cartas");
            encontradas = estado.getBooleanArray("encontradas");
            primera = estado.getInt("primera", -1);
            segunda = estado.getInt("segunda", -1);
            intentos = estado.getInt("intentos");
            parejas = estado.getInt("parejas");
            dibujar();
        }
    }
    private void nuevaPartida() {
        reloj.removeCallbacks(ocultar);
        ArrayList<Integer> orden = new ArrayList<>(Arrays.asList(0, 0, 1, 1, 2, 2, 3, 3));
        Collections.shuffle(orden);
        cartas = new int[8];
        encontradas = new boolean[8];
        for (int i = 0; i < 8; i++) cartas[i] = orden.get(i);
        primera = segunda = -1;
        intentos = parejas = 0;
        dibujar();
    }
    private void elegir(int posicion) {
        if (segunda >= 0 || encontradas[posicion] || posicion == primera) return;
        if (primera < 0) primera = posicion;
        else {
            segunda = posicion;
            intentos++;
            if (cartas[primera] == cartas[segunda]) {
                encontradas[primera] = encontradas[segunda] = true;
                parejas++;
                primera = segunda = -1;
            } else reloj.postDelayed(ocultar, 900);
        }
        dibujar();
    }
    private void dibujar() {
        for (int i = 0; i < 8; i++) {
            boolean visible = encontradas[i] || i == primera || i == segunda;
            botones[i].setText(visible ? figuras[cartas[i]] : "?");
            botones[i].setContentDescription("Carta " + (i + 1) + (visible ? ": " + figuras[cartas[i]] : ": oculta"));
            botones[i].setEnabled(!encontradas[i]);
        }
        marcador.setText(parejas == 4 ? "¡Ganaste en " + intentos + " intentos!" : "Parejas: " + parejas + "/4 · Intentos: " + intentos);
    }
    @Override protected void onResume() {
        super.onResume();
        if (segunda >= 0) reloj.postDelayed(ocultar, 900);
    }
    @Override protected void onPause() { reloj.removeCallbacks(ocultar); super.onPause(); }
    @Override protected void onSaveInstanceState(Bundle estado) {
        estado.putIntArray("cartas", cartas);
        estado.putBooleanArray("encontradas", encontradas);
        estado.putInt("primera", primera);
        estado.putInt("segunda", segunda);
        estado.putInt("intentos", intentos);
        estado.putInt("parejas", parejas);
        super.onSaveInstanceState(estado);
    }
}

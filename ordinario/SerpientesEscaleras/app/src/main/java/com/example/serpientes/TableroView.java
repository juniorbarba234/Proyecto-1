package com.example.serpientes;

import android.content.Context;
import android.graphics.*;
import android.view.View;

public class TableroView extends View {
    private final Paint pincel = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Partida partida;
    private float lado;
    public TableroView(Context contexto, Partida partida) { super(contexto); this.partida = partida; }
    @Override protected void onMeasure(int ancho, int alto) {
        int medida = MeasureSpec.getSize(ancho);
        setMeasuredDimension(medida, medida);
    }
    private PointF centro(int casilla) {
        int fila = (casilla - 1) / 10;
        int columna = (casilla - 1) % 10;
        if (fila % 2 == 1) columna = 9 - columna;
        return new PointF((columna + .5f) * lado, (9 - fila + .5f) * lado);
    }
    @Override protected void onDraw(Canvas lienzo) {
        super.onDraw(lienzo);
        lado = getWidth() / 10f;
        pincel.setStyle(Paint.Style.FILL);
        for (int numero = 1; numero <= 100; numero++) {
            PointF punto = centro(numero);
            pincel.setColor(numero % 2 == 0 ? Color.rgb(235, 241, 247) : Color.WHITE);
            lienzo.drawRect(punto.x - lado / 2, punto.y - lado / 2, punto.x + lado / 2, punto.y + lado / 2, pincel);
            pincel.setColor(Color.rgb(180, 192, 204));
            pincel.setStyle(Paint.Style.STROKE);
            pincel.setStrokeWidth(1);
            lienzo.drawRect(punto.x - lado / 2, punto.y - lado / 2, punto.x + lado / 2, punto.y + lado / 2, pincel);
            pincel.setStyle(Paint.Style.FILL);
        }
        for (int[] escalera : Partida.ESCALERAS) conectar(lienzo, escalera, false);
        for (int[] serpiente : Partida.SERPIENTES) conectar(lienzo, serpiente, true);
        pincel.setColor(Color.rgb(25, 35, 45));
        pincel.setTextSize(lado * .29f);
        pincel.setTextAlign(Paint.Align.LEFT);
        for (int numero = 1; numero <= 100; numero++) {
            PointF punto = centro(numero);
            lienzo.drawText(String.valueOf(numero), punto.x - lado * .44f, punto.y - lado * .17f, pincel);
        }
        for (int jugador = 0; jugador < 2; jugador++) {
            if (partida.posicion(jugador) == 0) continue;
            PointF punto = centro(partida.posicion(jugador));
            float x = punto.x + (jugador == 0 ? -.2f : .2f) * lado;
            pincel.setColor(jugador == 0 ? Color.rgb(25, 85, 195) : Color.rgb(195, 85, 0));
            lienzo.drawCircle(x, punto.y + lado * .15f, lado * .19f, pincel);
            pincel.setColor(Color.WHITE);
            pincel.setTextAlign(Paint.Align.CENTER);
            pincel.setTextSize(lado * .25f);
            lienzo.drawText(String.valueOf(jugador + 1), x, punto.y + lado * .24f, pincel);
        }
    }
    private void conectar(Canvas lienzo, int[] conexion, boolean serpiente) {
        PointF inicio = centro(conexion[0]), fin = centro(conexion[1]);
        double angulo = Math.atan2(fin.y - inicio.y, fin.x - inicio.x);
        float dx = (float) Math.cos(angulo), dy = (float) Math.sin(angulo);
        pincel.setColor(serpiente ? Color.argb(175, 205, 55, 55) : Color.argb(175, 20, 140, 75));
        pincel.setStrokeWidth(lado * .09f);
        if (serpiente) {
            pincel.setStyle(Paint.Style.STROKE);
            Path curva = new Path();
            curva.moveTo(inicio.x, inicio.y);
            curva.cubicTo(inicio.x - dy * lado, inicio.y + dx * lado, fin.x + dy * lado, fin.y - dx * lado, fin.x, fin.y);
            lienzo.drawPath(curva, pincel);
            pincel.setStyle(Paint.Style.FILL);
        } else {
            float separacion = lado * .1f;
            for (int signo : new int[]{-1, 1}) lienzo.drawLine(inicio.x - dy * separacion * signo, inicio.y + dx * separacion * signo, fin.x - dy * separacion * signo, fin.y + dx * separacion * signo, pincel);
            for (float paso = 0; paso < 1; paso += .15f) {
                float x = inicio.x + (fin.x - inicio.x) * paso, y = inicio.y + (fin.y - inicio.y) * paso;
                lienzo.drawLine(x - dy * separacion, y + dx * separacion, x + dy * separacion, y - dx * separacion, pincel);
            }
        }
        lienzo.drawCircle(fin.x, fin.y, lado * .11f, pincel);
    }
}

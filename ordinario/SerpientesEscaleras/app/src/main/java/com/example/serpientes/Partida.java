package com.example.serpientes;

public class Partida {
    public static final int[][] ESCALERAS = {{4, 25}, {13, 46}, {33, 49}, {50, 69}, {62, 81}, {74, 92}};
    public static final int[][] SERPIENTES = {{27, 5}, {40, 18}, {54, 31}, {76, 58}, {89, 53}, {99, 70}};
    private final int[] posiciones = {0, 0};
    private int turno;
    private int ganador = -1;

    public int posicion(int jugador) { return posiciones[jugador]; }
    public int turno() { return turno; }
    public int ganador() { return ganador; }
    public void reiniciar() { posiciones[0] = posiciones[1] = turno = 0; ganador = -1; }
    public String lanzar(int dado) {
        if (dado < 1 || dado > 6) throw new IllegalArgumentException("El dado debe ser de 1 a 6");
        if (ganador >= 0) return "La partida terminó";
        int jugador = turno;
        int destino = posiciones[jugador] + dado;
        String mensaje = "Jugador " + (jugador + 1) + " sacó " + dado + ". ";
        if (destino > 100) mensaje += "Necesita un número exacto para llegar a 100; permanece en su lugar.";
        else {
            int finalCasilla = destino;
            for (int[] escalera : ESCALERAS) if (escalera[0] == destino) finalCasilla = escalera[1];
            for (int[] serpiente : SERPIENTES) if (serpiente[0] == destino) finalCasilla = serpiente[1];
            mensaje += "Avanza a " + destino + ".";
            if (finalCasilla > destino) mensaje += " Sube por la escalera hasta " + finalCasilla + ".";
            if (finalCasilla < destino) mensaje += " Baja por la serpiente hasta " + finalCasilla + ".";
            posiciones[jugador] = finalCasilla;
            if (finalCasilla == 100) { ganador = jugador; return mensaje + " ¡Ganó!"; }
        }
        turno = 1 - turno;
        return mensaje;
    }
    public int[] guardar() { return new int[]{posiciones[0], posiciones[1], turno, ganador}; }
    public void restaurar(int[] estado) {
        if (estado == null || estado.length != 4) return;
        if (estado[0] < 0 || estado[0] > 100 || estado[1] < 0 || estado[1] > 100 || estado[2] < 0 || estado[2] > 1 || estado[3] < -1 || estado[3] > 1) return;
        posiciones[0] = estado[0]; posiciones[1] = estado[1]; turno = estado[2]; ganador = estado[3];
    }
}

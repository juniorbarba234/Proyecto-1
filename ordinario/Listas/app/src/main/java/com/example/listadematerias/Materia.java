package com.example.listadematerias;

public class Materia {
    private final String nombre;
    private final String descripcion;
    private final String estado;

    public Materia(String nombre, String descripcion, String estado) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.estado = estado;
    }

    public String getNombre() {
        return nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public String getEstado() {
        return estado;
    }
}


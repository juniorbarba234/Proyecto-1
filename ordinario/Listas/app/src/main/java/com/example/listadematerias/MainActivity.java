package com.example.listadematerias;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        RecyclerView listaMaterias = findViewById(R.id.listaMaterias);
        listaMaterias.setLayoutManager(new LinearLayoutManager(this));
        listaMaterias.setHasFixedSize(true);
        listaMaterias.setAdapter(new MateriaAdapter(crearMaterias()));
    }

    private List<Materia> crearMaterias() {
        List<Materia> materias = new ArrayList<>();
        materias.add(new Materia("Aplicaciones móviles", "Desarrollo de aplicaciones para Android", "En curso"));
        materias.add(new Materia("Desarrollo web", "Interfaces y servicios para la web", "En curso"));
        materias.add(new Materia("Base de datos", "Diseño y consulta de información", "Completada"));
        materias.add(new Materia("Redes", "Comunicación entre dispositivos", "En curso"));
        materias.add(new Materia("Programación", "Lógica y estructuras de código", "Completada"));
        materias.add(new Materia("Sistemas operativos", "Administración de recursos", "En curso"));
        materias.add(new Materia("Ingeniería de software", "Planeación y calidad de proyectos", "Pendiente"));
        materias.add(new Materia("Seguridad informática", "Protección de datos y sistemas", "Pendiente"));
        materias.add(new Materia("Inteligencia artificial", "Modelos y automatización", "Pendiente"));
        materias.add(new Materia("Proyecto integrador", "Aplicación de conocimientos del semestre", "En curso"));
        return materias;
    }
}


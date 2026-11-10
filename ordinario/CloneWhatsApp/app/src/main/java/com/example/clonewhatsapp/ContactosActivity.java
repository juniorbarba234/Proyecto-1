package com.example.clonewhatsapp;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.widget.EditText;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;

public class ContactosActivity extends AppCompatActivity {
    private ContactoAdapter adapter;
    private TextView destinatario;

    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_contactos);
        setTitle(R.string.contactos);
        destinatario = findViewById(R.id.txtDestinatario);
        RecyclerView recycler = findViewById(R.id.recyclerContactos);
        recycler.setLayoutManager(new LinearLayoutManager(this));
        adapter = new ContactoAdapter(this::seleccionar);
        recycler.setAdapter(adapter);
        EditText buscar = findViewById(R.id.edtBuscar);
        buscar.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) { }
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) { adapter.filtrar(s.toString()); }
            @Override public void afterTextChanged(Editable s) { }
        });
        cargar();
    }

    private void cargar() {
        SessionManager sesion = new SessionManager(this);
        if (!sesion.isActive()) {
            adapter.establecer(datosDemostracion());
            destinatario.setText("Modo demostración: selecciona un destinatario");
            return;
        }
        ProfilesApi.consultar(sesion.getAccessToken(), new ProfilesApi.CallbackResultado() {
            @Override public void correcto(List<Contacto> contactos) {
                runOnUiThread(() -> adapter.establecer(contactos.isEmpty() ? datosDemostracion() : contactos));
            }
            @Override public void error(String mensaje) {
                runOnUiThread(() -> {
                    adapter.establecer(datosDemostracion());
                    destinatario.setText("Demostración local disponible");
                });
            }
        });
    }

    private void seleccionar(Contacto contacto) {
        destinatario.setText(getString(R.string.destinatario_seleccionado, contacto.nombre));
    }

    private List<Contacto> datosDemostracion() {
        List<Contacto> lista = new ArrayList<>();
        lista.add(new Contacto("1", "Ana Martínez", "ana.martinez", ""));
        lista.add(new Contacto("2", "Carlos López", "carlos.lopez", ""));
        lista.add(new Contacto("3", "María García", "maria.garcia", ""));
        lista.add(new Contacto("4", "Profesor Aplicaciones", "profesor", ""));
        return lista;
    }
}

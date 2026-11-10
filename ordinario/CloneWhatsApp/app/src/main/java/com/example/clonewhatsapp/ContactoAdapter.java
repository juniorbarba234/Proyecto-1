package com.example.clonewhatsapp;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class ContactoAdapter extends RecyclerView.Adapter<ContactoAdapter.ContactoViewHolder> {
    public interface OnContactoClick { void seleccionar(Contacto contacto); }

    private final List<Contacto> originales = new ArrayList<>();
    private final List<Contacto> visibles = new ArrayList<>();
    private final OnContactoClick listener;

    public ContactoAdapter(OnContactoClick listener) { this.listener = listener; }

    public void establecer(List<Contacto> contactos) {
        originales.clear();
        originales.addAll(contactos);
        filtrar("");
    }

    public void filtrar(String texto) {
        String consulta = texto.trim().toLowerCase(Locale.ROOT);
        visibles.clear();
        for (Contacto contacto : originales) {
            if (contacto.nombre.toLowerCase(Locale.ROOT).contains(consulta)
                    || contacto.usuario.toLowerCase(Locale.ROOT).contains(consulta)) {
                visibles.add(contacto);
            }
        }
        notifyDataSetChanged();
    }

    @NonNull @Override
    public ContactoViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_contacto, parent, false);
        return new ContactoViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ContactoViewHolder holder, int position) {
        Contacto contacto = visibles.get(position);
        holder.nombre.setText(contacto.nombre);
        holder.usuario.setText("@" + contacto.usuario);
        String inicial = contacto.nombre.isBlank() ? "?" : contacto.nombre.substring(0, 1).toUpperCase(Locale.ROOT);
        holder.avatar.setText(inicial);
        holder.itemView.setOnClickListener(view -> listener.seleccionar(contacto));
    }

    @Override public int getItemCount() { return visibles.size(); }

    static class ContactoViewHolder extends RecyclerView.ViewHolder {
        final TextView avatar, nombre, usuario;
        ContactoViewHolder(View view) {
            super(view);
            avatar = view.findViewById(R.id.txtAvatar);
            nombre = view.findViewById(R.id.txtNombreContacto);
            usuario = view.findViewById(R.id.txtUsuarioContacto);
        }
    }
}

package com.example.listadematerias;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class MateriaAdapter extends RecyclerView.Adapter<MateriaAdapter.MateriaViewHolder> {
    private final List<Materia> materias;

    public MateriaAdapter(List<Materia> materias) {
        this.materias = materias;
    }

    @NonNull
    @Override
    public MateriaViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View vista = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_materia, parent, false);
        return new MateriaViewHolder(vista);
    }

    @Override
    public void onBindViewHolder(@NonNull MateriaViewHolder holder, int position) {
        Materia materia = materias.get(position);
        holder.nombre.setText(materia.getNombre());
        holder.descripcion.setText(materia.getDescripcion());
        holder.estado.setText(materia.getEstado());
    }

    @Override
    public int getItemCount() {
        return materias.size();
    }

    static class MateriaViewHolder extends RecyclerView.ViewHolder {
        final TextView nombre;
        final TextView descripcion;
        final TextView estado;

        MateriaViewHolder(@NonNull View itemView) {
            super(itemView);
            nombre = itemView.findViewById(R.id.tvNombre);
            descripcion = itemView.findViewById(R.id.tvDescripcion);
            estado = itemView.findViewById(R.id.tvEstado);
        }
    }
}


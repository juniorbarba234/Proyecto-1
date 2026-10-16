package com.example.actividadesandroid

import android.os.Bundle
import android.util.Log
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.button.MaterialButton

class MainActivity : AppCompatActivity() {
    private lateinit var textoMostrado: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        Log.d("CicloVida", "onCreate()")
        Toast.makeText(this, "onCreate()", Toast.LENGTH_SHORT).show()

        val entrada = findViewById<EditText>(R.id.editValor)
        textoMostrado = findViewById(R.id.txtResultado)

        textoMostrado.text = savedInstanceState?.getString("dato_mostrado") ?: "Aquí aparecerá el dato"

        findViewById<MaterialButton>(R.id.btnMostrar).setOnClickListener {
            val valor = entrada.text.toString()
            textoMostrado.text = if (valor.isBlank()) "Escribe un valor" else valor
        }
    }

    override fun onPause() {
        super.onPause()
        Log.d("CicloVida", "onPause()")
        Toast.makeText(this, "onPause()", Toast.LENGTH_SHORT).show()
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.d("CicloVida", "onDestroy()")
        Toast.makeText(this, "onDestroy()", Toast.LENGTH_SHORT).show()
    }

    override fun onSaveInstanceState(outState: Bundle) {
        outState.putString("dato_mostrado", textoMostrado.text.toString())
        super.onSaveInstanceState(outState)
    }
}

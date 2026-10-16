package com.example.actividadesandroid

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.google.android.material.button.MaterialButton

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        findViewById<MaterialButton>(R.id.btnFragmentoUno).setOnClickListener {
            mostrarFragmento(PrimerFragment())
        }
        findViewById<MaterialButton>(R.id.btnFragmentoDos).setOnClickListener {
            mostrarFragmento(SegundoFragment())
        }
        findViewById<MaterialButton>(R.id.btnFragmentoTres).setOnClickListener {
            mostrarFragmento(TercerFragment())
        }

        if (savedInstanceState == null) {
            mostrarFragmento(PrimerFragment())
        }
    }

    private fun mostrarFragmento(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragmentContainer, fragment)
            .commit()
    }
}

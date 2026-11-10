package com.example.layoutspropios;

import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    @Override protected void onCreate(Bundle state) {
        super.onCreate(state);
        setContentView(R.layout.activity_main);
        findViewById(R.id.btnLinear).setOnClickListener(v -> abrir(LinearDemoActivity.class));
        findViewById(R.id.btnFrame).setOnClickListener(v -> abrir(FrameDemoActivity.class));
        findViewById(R.id.btnRelative).setOnClickListener(v -> abrir(RelativeDemoActivity.class));
        findViewById(R.id.btnTable).setOnClickListener(v -> abrir(TableDemoActivity.class));
    }
    private void abrir(Class<?> pantalla) { startActivity(new Intent(this, pantalla)); }
}

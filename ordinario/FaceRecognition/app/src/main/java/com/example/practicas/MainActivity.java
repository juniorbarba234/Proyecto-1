package com.example.practicas;

import android.net.Uri;
import android.os.Bundle;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.core.content.FileProvider;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.face.*;
import java.io.File;

public class MainActivity extends AppCompatActivity {
    private ImageView foto;
    private TextView resultado;
    private Button tomar, elegir;
    private Uri captura;
    private final FaceDetector detector = FaceDetection.getClient(new FaceDetectorOptions.Builder()
            .setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_ACCURATE).build());
    private final ActivityResultLauncher<Uri> camara = registerForActivityResult(
            new ActivityResultContracts.TakePicture(), guardada -> {
                if (guardada && captura != null) detectar(captura);
                else resultado.setText("Captura cancelada");
            });
    private final ActivityResultLauncher<String> galeria = registerForActivityResult(
            new ActivityResultContracts.GetContent(), uri -> { if (uri != null) detectar(uri); });

    @Override public void onCreate(Bundle estado) {
        super.onCreate(estado);
        setTitle("Contador de rostros");
        LinearLayout panel = new LinearLayout(this);
        panel.setOrientation(LinearLayout.VERTICAL);
        panel.setPadding(24, 24, 24, 24);
        ScrollView scroll = new ScrollView(this);
        scroll.addView(panel);
        setContentView(scroll);
        TextView instrucciones = new TextView(this);
        instrucciones.setText("Toma o elige una fotografía con buena luz para contar los rostros.");
        panel.addView(instrucciones);
        tomar = new Button(this);
        tomar.setText("Tomar foto");
        tomar.setOnClickListener(v -> tomarFoto());
        panel.addView(tomar);
        elegir = new Button(this);
        elegir.setText("Elegir imagen");
        elegir.setOnClickListener(v -> galeria.launch("image/*"));
        panel.addView(elegir);
        foto = new ImageView(this);
        foto.setAdjustViewBounds(true);
        panel.addView(foto, new LinearLayout.LayoutParams(-1, 650));
        resultado = new TextView(this);
        resultado.setTextSize(22);
        resultado.setText("Selecciona una foto para comenzar");
        panel.addView(resultado);
        if (estado != null && estado.getString("captura") != null) captura = Uri.parse(estado.getString("captura"));
    }
    private void tomarFoto() {
        try {
            File carpeta = new File(getCacheDir(), "capturas");
            if (!carpeta.exists() && !carpeta.mkdirs()) throw new java.io.IOException();
            File archivo = new File(carpeta, "foto.jpg");
            captura = FileProvider.getUriForFile(this, getPackageName() + ".fotos", archivo);
            camara.launch(captura);
        } catch (Exception error) { resultado.setText("No se pudo abrir la cámara"); }
    }
    private void detectar(Uri uri) {
        resultado.setText("Analizando imagen...");
        tomar.setEnabled(false);
        elegir.setEnabled(false);
        try {
            InputImage imagen = InputImage.fromFilePath(this, uri);
            foto.setImageURI(null);
            foto.setImageURI(uri);
            detector.process(imagen).addOnSuccessListener(this, rostros -> {
                resultado.setText(rostros.isEmpty() ? "No se detectaron rostros" : "Rostros detectados: " + rostros.size());
            }).addOnFailureListener(this, error -> resultado.setText("No se pudo analizar la foto"))
              .addOnCompleteListener(this, tarea -> { tomar.setEnabled(true); elegir.setEnabled(true); });
        } catch (Exception error) {
            resultado.setText("No se pudo leer la imagen");
            tomar.setEnabled(true);
            elegir.setEnabled(true);
        }
    }
    @Override protected void onSaveInstanceState(Bundle estado) {
        if (captura != null) estado.putString("captura", captura.toString());
        super.onSaveInstanceState(estado);
    }
    @Override protected void onDestroy() { detector.close(); super.onDestroy(); }
}

package com.example.paneldesensores;

import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import java.util.Locale;

public class MainActivity extends AppCompatActivity implements SensorEventListener {
    private SensorManager sensorManager;
    private Sensor acelerometro;
    private Sensor giroscopio;
    private Sensor magnetometro;
    private Sensor luz;
    private TextView valorAcelerometro;
    private TextView valorGiroscopio;
    private TextView valorMagnetometro;
    private TextView valorLuz;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        valorAcelerometro = findViewById(R.id.valorAcelerometro);
        valorGiroscopio = findViewById(R.id.valorGiroscopio);
        valorMagnetometro = findViewById(R.id.valorMagnetometro);
        valorLuz = findViewById(R.id.valorLuz);

        sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
        acelerometro = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        giroscopio = sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE);
        magnetometro = sensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD);
        luz = sensorManager.getDefaultSensor(Sensor.TYPE_LIGHT);

        mostrarDisponibilidad(acelerometro, valorAcelerometro);
        mostrarDisponibilidad(giroscopio, valorGiroscopio);
        mostrarDisponibilidad(magnetometro, valorMagnetometro);
        mostrarDisponibilidad(luz, valorLuz);
    }

    @Override
    protected void onResume() {
        super.onResume();
        registrar(acelerometro);
        registrar(giroscopio);
        registrar(magnetometro);
        registrar(luz);
    }

    @Override
    protected void onPause() {
        super.onPause();
        sensorManager.unregisterListener(this);
    }

    private void registrar(Sensor sensor) {
        if (sensor != null) {
            sensorManager.registerListener(this, sensor, SensorManager.SENSOR_DELAY_NORMAL);
        }
    }

    private void mostrarDisponibilidad(Sensor sensor, TextView vista) {
        if (sensor == null) {
            vista.setText("No disponible en este dispositivo");
        } else {
            vista.setText("Esperando lectura...");
        }
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() == Sensor.TYPE_LIGHT) {
            valorLuz.setText(String.format(Locale.getDefault(), "%.1f lx", event.values[0]));
            return;
        }

        String lectura = String.format(
                Locale.getDefault(),
                "X: %.2f   Y: %.2f   Z: %.2f",
                event.values[0], event.values[1], event.values[2]
        );

        if (event.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
            valorAcelerometro.setText(lectura);
        } else if (event.sensor.getType() == Sensor.TYPE_GYROSCOPE) {
            valorGiroscopio.setText(lectura);
        } else if (event.sensor.getType() == Sensor.TYPE_MAGNETIC_FIELD) {
            valorMagnetometro.setText(lectura);
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
    }
}


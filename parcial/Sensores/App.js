import { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Accelerometer, Gyroscope, Magnetometer, Pedometer } from 'expo-sensors';

const INITIAL_VECTOR = { x: 0, y: 0, z: 0 };
const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum);
const fixed = (value) => (Number.isFinite(value) ? value.toFixed(2) : '0.00');

function VectorCard({ icon, title, subtitle, value, color }) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: `${color}20` }]}><Text style={styles.icon}>{icon}</Text></View>
      <View style={styles.cardCopy}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
        <View style={styles.valuesRow}>
          {['x', 'y', 'z'].map((axis) => (
            <View key={axis} style={styles.valueBox}>
              <Text style={styles.axis}>{axis.toUpperCase()}</Text>
              <Text style={[styles.value, { color }]}>{fixed(value[axis])}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default function App() {
  const [accelerometer, setAccelerometer] = useState(INITIAL_VECTOR);
  const [gyroscope, setGyroscope] = useState(INITIAL_VECTOR);
  const [magnetometer, setMagnetometer] = useState(INITIAL_VECTOR);
  const [steps, setSteps] = useState(0);
  const [pedometerStatus, setPedometerStatus] = useState('Comprobando sensor…');

  useEffect(() => {
    Accelerometer.setUpdateInterval(180);
    Gyroscope.setUpdateInterval(180);
    Magnetometer.setUpdateInterval(250);

    const accelerometerSubscription = Accelerometer.addListener(setAccelerometer);
    const gyroscopeSubscription = Gyroscope.addListener(setGyroscope);
    const magnetometerSubscription = Magnetometer.addListener(setMagnetometer);
    let pedometerSubscription;
    let mounted = true;

    const connectPedometer = async () => {
      try {
        const available = await Pedometer.isAvailableAsync();
        if (!mounted) return;
        if (!available) {
          setPedometerStatus('No disponible en este dispositivo');
          return;
        }
        const permission = await Pedometer.requestPermissionsAsync();
        if (!mounted) return;
        if (permission.status !== 'granted') {
          setPedometerStatus('Permiso de actividad física no concedido');
          return;
        }
        setPedometerStatus('Caminando ahora');
        pedometerSubscription = Pedometer.watchStepCount(({ steps: count }) => setSteps(count));
      } catch {
        if (mounted) setPedometerStatus('No fue posible iniciar el podómetro');
      }
    };

    connectPedometer();
    return () => {
      mounted = false;
      accelerometerSubscription.remove();
      gyroscopeSubscription.remove();
      magnetometerSubscription.remove();
      pedometerSubscription?.remove();
    };
  }, []);

  const heading = useMemo(() => {
    const angle = Math.atan2(magnetometer.y, magnetometer.x) * (180 / Math.PI);
    return Math.round((angle + 360) % 360);
  }, [magnetometer]);
  const direction = useMemo(() => ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'][Math.round(heading / 45) % 8], [heading]);
  const ballLeft = clamp(105 + accelerometer.x * 78, 8, 202);
  const ballTop = clamp(82 - accelerometer.y * 68, 8, 156);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#071B33" />
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroGlow} />
          <Text style={styles.eyebrow}>EJERCICIO · EXPO SENSORS</Text>
          <Text style={styles.title}>Laboratorio de sensores</Text>
          <Text style={styles.description}>Mueve, gira e inclina el teléfono para observar sus sensores en tiempo real.</Text>
          <View style={styles.liveBadge}><View style={styles.liveDot} /><Text style={styles.liveText}>LECTURAS EN VIVO</Text></View>
        </View>

        <Text style={styles.sectionTitle}>Movimiento del dispositivo</Text>
        <VectorCard icon="📱" title="Acelerómetro" subtitle="Aceleración sobre los tres ejes" value={accelerometer} color="#18A77B" />
        <VectorCard icon="🌀" title="Giroscopio" subtitle="Velocidad de rotación" value={gyroscope} color="#6D5CE7" />

        <Text style={styles.sectionTitle}>Prueba de inclinación</Text>
        <View style={styles.demoCard}>
          <View style={styles.demoHeader}>
            <View><Text style={styles.demoTitle}>Controla la esfera</Text><Text style={styles.demoSubtitle}>Inclina el teléfono para moverla</Text></View>
            <Text style={styles.demoIcon}>🎯</Text>
          </View>
          <View style={styles.playground}>
            <View style={styles.horizontalGuide} /><View style={styles.verticalGuide} />
            <View style={[styles.ball, { left: ballLeft, top: ballTop }]}><View style={styles.ballShine} /></View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Orientación y actividad</Text>
        <View style={styles.twoColumns}>
          <View style={styles.smallCard}>
            <Text style={styles.smallIcon}>🧭</Text><Text style={styles.smallLabel}>BRÚJULA</Text>
            <Text style={styles.compassDirection}>{direction}</Text><Text style={styles.compassDegrees}>{heading}°</Text>
            <View style={[styles.compassNeedle, { transform: [{ rotate: `${heading}deg` }] }]}><View style={styles.needleNorth} /><View style={styles.needleSouth} /></View>
          </View>
          <View style={styles.smallCard}>
            <Text style={styles.smallIcon}>👟</Text><Text style={styles.smallLabel}>PODÓMETRO</Text>
            <Text style={styles.steps}>{steps}</Text><Text style={styles.stepsLabel}>pasos de esta sesión</Text>
            <Text style={styles.sensorStatus}>{pedometerStatus}</Text>
          </View>
        </View>

        <View style={styles.notice}><Text style={styles.noticeIcon}>💡</Text><Text style={styles.noticeText}>Algunos emuladores no incluyen todos los sensores. Para una prueba completa, abre el proyecto en Expo Go desde un teléfono físico.</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#071B33' }, page: { backgroundColor: '#F3F7FB', paddingBottom: 36 },
  hero: { backgroundColor: '#071B33', paddingHorizontal: 22, paddingTop: 28, paddingBottom: 28, overflow: 'hidden' }, heroGlow: { position: 'absolute', width: 210, height: 210, borderRadius: 105, backgroundColor: 'rgba(29,201,151,0.16)', right: -78, top: -90 },
  eyebrow: { color: '#72E2C0', fontSize: 11, fontWeight: '800', letterSpacing: 1.5 }, title: { color: '#FFFFFF', fontSize: 30, fontWeight: '900', marginTop: 8 }, description: { color: '#B7C7D8', fontSize: 14, lineHeight: 21, marginTop: 8, maxWidth: 330 },
  liveBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.09)', borderRadius: 20, paddingHorizontal: 11, paddingVertical: 7, marginTop: 16 }, liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#40E0AC', marginRight: 7 }, liveText: { color: '#D8FFF3', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  sectionTitle: { color: '#15263A', fontSize: 17, fontWeight: '900', marginHorizontal: 18, marginTop: 22, marginBottom: 10 },
  card: { backgroundColor: '#FFFFFF', marginHorizontal: 18, marginBottom: 11, borderRadius: 21, padding: 15, flexDirection: 'row', shadowColor: '#18324D', shadowOpacity: 0.08, shadowRadius: 13, shadowOffset: { width: 0, height: 5 }, elevation: 3 }, iconBox: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }, icon: { fontSize: 25 }, cardCopy: { flex: 1, marginLeft: 13 }, cardTitle: { color: '#15263A', fontSize: 17, fontWeight: '900' }, cardSubtitle: { color: '#718096', fontSize: 11, marginTop: 2 },
  valuesRow: { flexDirection: 'row', marginTop: 13, gap: 7 }, valueBox: { flex: 1, backgroundColor: '#F4F7FA', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 9 }, axis: { color: '#8A99A8', fontSize: 9, fontWeight: '900' }, value: { fontSize: 15, fontWeight: '900', marginTop: 2 },
  demoCard: { backgroundColor: '#FFFFFF', marginHorizontal: 18, borderRadius: 22, padding: 16, shadowColor: '#18324D', shadowOpacity: 0.08, shadowRadius: 13, shadowOffset: { width: 0, height: 5 }, elevation: 3 }, demoHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }, demoTitle: { color: '#15263A', fontSize: 17, fontWeight: '900' }, demoSubtitle: { color: '#718096', fontSize: 11, marginTop: 3 }, demoIcon: { fontSize: 27 },
  playground: { height: 205, borderRadius: 18, backgroundColor: '#071B33', overflow: 'hidden', position: 'relative' }, horizontalGuide: { position: 'absolute', left: 0, right: 0, top: '50%', height: 1, backgroundColor: 'rgba(255,255,255,0.08)' }, verticalGuide: { position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, backgroundColor: 'rgba(255,255,255,0.08)' }, ball: { position: 'absolute', width: 42, height: 42, borderRadius: 21, backgroundColor: '#29D8A2', borderWidth: 3, borderColor: '#A5FFE4', shadowColor: '#29D8A2', shadowOpacity: 0.8, shadowRadius: 12, elevation: 8 }, ballShine: { width: 11, height: 7, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.72)', marginLeft: 8, marginTop: 7 },
  twoColumns: { flexDirection: 'row', marginHorizontal: 18, gap: 11 }, smallCard: { flex: 1, minHeight: 225, backgroundColor: '#FFFFFF', borderRadius: 22, padding: 15, alignItems: 'center', shadowColor: '#18324D', shadowOpacity: 0.08, shadowRadius: 13, shadowOffset: { width: 0, height: 5 }, elevation: 3 }, smallIcon: { fontSize: 27 }, smallLabel: { color: '#718096', fontSize: 10, fontWeight: '900', letterSpacing: 1.2, marginTop: 7 }, compassDirection: { color: '#15263A', fontSize: 29, fontWeight: '900', marginTop: 8 }, compassDegrees: { color: '#6D5CE7', fontSize: 14, fontWeight: '800' },
  compassNeedle: { width: 30, height: 54, alignItems: 'center', marginTop: 9 }, needleNorth: { width: 0, height: 0, borderLeftWidth: 7, borderRightWidth: 7, borderBottomWidth: 26, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#EB4D62' }, needleSouth: { width: 0, height: 0, borderLeftWidth: 7, borderRightWidth: 7, borderTopWidth: 26, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#DCE4EC' },
  steps: { color: '#18A77B', fontSize: 42, fontWeight: '900', marginTop: 16 }, stepsLabel: { color: '#3E5165', fontSize: 11, fontWeight: '700', textAlign: 'center' }, sensorStatus: { color: '#8A99A8', fontSize: 9, lineHeight: 13, textAlign: 'center', marginTop: 16 }, notice: { flexDirection: 'row', backgroundColor: '#E7F7F2', borderRadius: 18, padding: 14, marginHorizontal: 18, marginTop: 18 }, noticeIcon: { fontSize: 20, marginRight: 10 }, noticeText: { flex: 1, color: '#356153', fontSize: 11, lineHeight: 17 },
});

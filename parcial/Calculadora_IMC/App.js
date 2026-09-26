import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

function classify(value) {
  if (value < 18.5) return { name: 'Bajo peso', color: '#b56b2c', advice: 'Procura una alimentación suficiente y variada.' };
  if (value < 25) return { name: 'Peso saludable', color: '#2b815d', advice: 'Mantén tus hábitos de alimentación y movimiento.' };
  if (value < 30) return { name: 'Sobrepeso', color: '#b56b2c', advice: 'Pequeños cambios constantes pueden ayudarte.' };
  return { name: 'Obesidad', color: '#a43e52', advice: 'Consulta a un profesional para recibir orientación personalizada.' };
}

export default function App() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const calculate = () => {
    const kg = Number(weight.replace(',', '.'));
    const cm = Number(height.replace(',', '.'));
    if (!kg || !cm || kg <= 0 || cm <= 0 || kg > 500 || cm > 260) { setResult(null); setMessage('Escribe un peso y una estatura válidos.'); return; }
    const value = kg / ((cm / 100) ** 2);
    setResult({ value, ...classify(value) }); setMessage('');
  };
  const clear = () => { setWeight(''); setHeight(''); setResult(null); setMessage(''); };
  const display = useMemo(() => result ? result.value.toFixed(1) : '—', [result]);
  return <SafeAreaView style={s.safe}><StatusBar style="dark"/><KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps="handled">
      <Text style={s.kicker}>BIENESTAR / HERRAMIENTA</Text><Text style={s.title}>Tu peso, en contexto.</Text><Text style={s.intro}>Calcula tu índice de masa corporal de forma sencilla. Es una referencia, no un diagnóstico médico.</Text>
      <View style={s.result}><View><Text style={s.resultLabel}>Tu IMC</Text><Text style={s.number}>{display}</Text></View>{result ? <View style={[s.badge, { backgroundColor: result.color }]}><Text style={s.badgeText}>{result.name}</Text></View> : <Text style={s.placeholder}>Completa los datos</Text>}</View>
      {result && <View style={s.advice}><Text style={s.adviceTitle}>Una nota para ti</Text><Text style={s.adviceText}>{result.advice}</Text></View>}
      <View style={s.form}><Text style={s.formTitle}>Tus medidas</Text><Text style={s.label}>Peso <Text style={s.unit}>(kg)</Text></Text><TextInput accessibilityLabel="Peso en kilogramos" keyboardType="decimal-pad" value={weight} onChangeText={setWeight} placeholder="Ej. 68" placeholderTextColor="#9aa5ae" style={s.input}/><Text style={s.label}>Estatura <Text style={s.unit}>(cm)</Text></Text><TextInput accessibilityLabel="Estatura en centímetros" keyboardType="decimal-pad" value={height} onChangeText={setHeight} placeholder="Ej. 170" placeholderTextColor="#9aa5ae" style={s.input}/>{message ? <Text accessibilityRole="alert" style={s.error}>{message}</Text> : null}<Pressable accessibilityRole="button" onPress={calculate} style={s.primary}><Text style={s.primaryText}>Calcular mi IMC</Text></Pressable><Pressable accessibilityRole="button" onPress={clear} style={s.clear}><Text style={s.clearText}>Limpiar datos</Text></Pressable></View>
      <Text style={s.footer}>Rangos orientativos para adultos. Si tienes dudas sobre tu salud, habla con un profesional.</Text>
    </ScrollView>
  </KeyboardAvoidingView></SafeAreaView>;
}
const s = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#f4f1ea', paddingTop: Platform.OS === 'android' ? 30 : 0 }, flex: { flex: 1 }, page: { padding: 24, paddingBottom: 42 }, kicker: { color: '#637455', fontSize: 12, fontWeight: '800', letterSpacing: 1.3 }, title: { color: '#213347', fontSize: 36, lineHeight: 42, fontWeight: '800', marginTop: 12 }, intro: { color: '#647081', fontSize: 15, lineHeight: 23, marginTop: 10, marginBottom: 24 }, result: { backgroundColor: '#213347', borderRadius: 24, padding: 22, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, resultLabel: { color: '#bfcad4', fontWeight: '700' }, number: { color: '#fff', fontSize: 52, fontWeight: '800', marginTop: 4 }, placeholder: { color: '#bfcad4', maxWidth: 100, textAlign: 'right' }, badge: { borderRadius: 18, paddingHorizontal: 12, paddingVertical: 9, maxWidth: 120 }, badgeText: { color: '#fff', fontWeight: '800', textAlign: 'center' }, advice: { backgroundColor: '#dce6d4', padding: 16, borderRadius: 16, marginTop: 14 }, adviceTitle: { color: '#304829', fontWeight: '800', marginBottom: 4 }, adviceText: { color: '#53624d', lineHeight: 21 }, form: { backgroundColor: '#fff', borderRadius: 22, padding: 20, marginTop: 18, borderWidth: 1, borderColor: '#e5e2dc' }, formTitle: { color: '#213347', fontSize: 20, fontWeight: '800', marginBottom: 8 }, label: { color: '#47566a', fontWeight: '700', marginTop: 12, marginBottom: 7 }, unit: { color: '#8993a0', fontWeight: '500' }, input: { backgroundColor: '#f3f5f6', borderRadius: 12, padding: 15, color: '#213347', fontSize: 17 }, primary: { backgroundColor: '#637455', borderRadius: 13, padding: 16, alignItems: 'center', marginTop: 18 }, primaryText: { color: '#fff', fontWeight: '800', fontSize: 16 }, clear: { alignItems: 'center', padding: 14 }, clearText: { color: '#637455', fontWeight: '700' }, error: { color: '#a43e52', marginTop: 12 }, footer: { color: '#87919a', textAlign: 'center', lineHeight: 19, fontSize: 12, marginTop: 22 }
});

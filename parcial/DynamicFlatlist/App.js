import React, { useState } from 'react';
import { FlatList, Modal, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const courses = [
  { id: 'moviles', title: 'Aplicaciones móviles', hours: 20, rating: '4.9', icon: '📱', color: '#e4eaff', category: 'Desarrollo', description: 'Construye interfaces móviles con React Native y Expo.', topics: ['Componentes y propiedades', 'Estado y eventos', 'Listas y navegación'] },
  { id: 'datos', title: 'Bases de datos', hours: 30, rating: '4.8', icon: '🗂️', color: '#e0f2e7', category: 'Datos', description: 'Organiza información y consulta datos desde una aplicación.', topics: ['Modelado de datos', 'Consultas y operaciones CRUD', 'Conexión con una API'] },
  { id: 'redes', title: 'Redes de computadoras', hours: 40, rating: '4.7', icon: '🌐', color: '#dff2fa', category: 'Infraestructura', description: 'Conoce cómo se comunican los dispositivos en una red.', topics: ['Direcciones IP', 'Enrutamiento', 'Diagnóstico de conectividad'] },
  { id: 'web', title: 'Desarrollo web', hours: 25, rating: '4.9', icon: '💻', color: '#ffecd9', category: 'Desarrollo', description: 'Diseña páginas adaptables e interfaces interactivas.', topics: ['HTML y CSS', 'JavaScript', 'Diseño adaptable'] },
  { id: 'seguridad', title: 'Ciberseguridad', hours: 30, rating: '4.8', icon: '🔐', color: '#efe4fa', category: 'Infraestructura', description: 'Aprende principios para proteger aplicaciones e información.', topics: ['Autenticación', 'Permisos de acceso', 'Protección de datos'] },
];

export default function App() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const normalized = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const visible = courses.filter(course => normalized(course.title + ' ' + course.category).includes(normalized(query.trim())));
  return <SafeAreaView style={s.safe}>
    <StatusBar style="dark" />
    <FlatList data={visible} keyExtractor={item => item.id} contentContainerStyle={s.list} keyboardShouldPersistTaps="handled"
      ListHeaderComponent={<View>
        <Text style={s.eyebrow}>CAMPUS / CATÁLOGO ACADÉMICO</Text>
        <Text style={s.heading}>Tu próxima habilidad.</Text>
        <Text style={s.subtitle}>Explora los cursos y toca una tarjeta para conocer sus temas.</Text>
        <View style={s.summary}><Text style={s.summaryTitle}>{courses.length} cursos para explorar</Text><Text style={s.summaryText}>Aprende algo nuevo, a tu ritmo.</Text></View>
        <TextInput accessibilityLabel="Buscar cursos" style={s.search} placeholder="Buscar curso o área…" placeholderTextColor="#737e91" value={query} onChangeText={setQuery} returnKeyType="search" />
        <View style={s.section}><Text style={s.sectionTitle}>Catálogo</Text><Text style={s.count}>{visible.length} resultados</Text></View>
      </View>}
      ListEmptyComponent={<View style={s.empty}><Text style={s.sectionTitle}>Sin coincidencias</Text><Text style={s.subtitle}>Prueba con otra palabra.</Text><Pressable accessibilityRole="button" onPress={() => setQuery('')} style={s.button}><Text style={s.buttonText}>Ver todos los cursos</Text></Pressable></View>}
      renderItem={({ item }) => <Pressable accessibilityRole="button" accessibilityLabel={'Ver detalles de ' + item.title} onPress={() => setSelected(item)} style={({ pressed }) => [s.card, pressed && s.pressed]}>
        <View style={[s.iconBox, { backgroundColor: item.color }]}><Text style={s.icon}>{item.icon}</Text></View>
        <View style={s.cardBody}><Text style={s.category}>{item.category}</Text><Text style={s.cardTitle}>{item.title}</Text><Text style={s.meta}>{item.hours} horas · ★ {item.rating}</Text></View><Text style={s.arrow}>›</Text>
      </Pressable>}
      ListFooterComponent={<Text style={s.footer}>Práctica escolar · Datos de ejemplo</Text>}
    />
    <Modal visible={selected !== null} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
      <View style={s.overlay}><View style={s.sheet} accessibilityViewIsModal>
        <ScrollView contentContainerStyle={s.sheetContent}>
          <View style={s.sheetTop}><Text style={s.eyebrow}>DETALLES DEL CURSO</Text><Pressable accessibilityRole="button" accessibilityLabel="Cerrar detalles" onPress={() => setSelected(null)} style={s.close}><Text style={s.closeText}>✕</Text></Pressable></View>
          {selected && <><View style={[s.iconBox, { backgroundColor: selected.color }]}><Text style={s.icon}>{selected.icon}</Text></View><Text style={s.modalTitle}>{selected.title}</Text><Text style={s.meta}>{selected.hours} horas · ★ {selected.rating} · {selected.category}</Text><Text style={s.description}>{selected.description}</Text><Text style={s.sectionTitle}>Lo que aprenderás</Text>{selected.topics.map((topic, index) => <View style={s.topic} key={topic}><Text style={s.topicNumber}>{index + 1}</Text><Text style={s.topicText}>{topic}</Text></View>)}</>}
          <Pressable accessibilityRole="button" onPress={() => setSelected(null)} style={s.button}><Text style={s.buttonText}>Volver al catálogo</Text></Pressable>
        </ScrollView>
      </View></View>
    </Modal>
  </SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f6fb', paddingTop: Platform.OS === 'android' ? 32 : 0 }, list: { padding: 22, paddingBottom: 36 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1.4, color: '#5862a6' }, heading: { fontSize: 34, fontWeight: '800', color: '#202642', marginTop: 14 }, subtitle: { color: '#687187', fontSize: 15, lineHeight: 23, marginTop: 8 },
  summary: { backgroundColor: '#293259', borderRadius: 20, padding: 22, marginVertical: 22 }, summaryTitle: { color: '#fff', fontSize: 19, fontWeight: '700' }, summaryText: { color: '#c7cce4', marginTop: 8 }, search: { backgroundColor: '#fff', borderRadius: 14, padding: 16, fontSize: 16, color: '#202642', borderWidth: 1, borderColor: '#e4e7f0' },
  section: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 26, marginBottom: 15 }, sectionTitle: { fontSize: 18, fontWeight: '700', color: '#202642' }, count: { color: '#788198', fontSize: 12 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 18, marginBottom: 12, borderWidth: 1, borderColor: '#e7e9f1' }, pressed: { opacity: .7 }, iconBox: { width: 54, height: 54, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }, icon: { fontSize: 26 }, cardBody: { flex: 1, marginHorizontal: 13 }, category: { color: '#75809b', fontSize: 11, marginBottom: 5 }, cardTitle: { fontSize: 17, fontWeight: '700', color: '#202642' }, meta: { color: '#747d91', fontSize: 13, marginTop: 8 }, arrow: { fontSize: 28, color: '#7882a2' }, footer: { color: '#8c94a5', textAlign: 'center', marginTop: 20, fontSize: 12 }, empty: { paddingVertical: 30 },
  overlay: { flex: 1, backgroundColor: 'rgba(16,23,47,.55)', justifyContent: 'flex-end' }, sheet: { maxHeight: '90%', backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28 }, sheetContent: { padding: 26, paddingBottom: 42 }, sheetTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }, close: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f0f2f8', alignItems: 'center', justifyContent: 'center' }, closeText: { color: '#293259', fontSize: 20 }, modalTitle: { fontSize: 28, color: '#202642', fontWeight: '800', marginTop: 18 }, description: { fontSize: 16, lineHeight: 25, color: '#687187', marginVertical: 22 }, topic: { flexDirection: 'row', alignItems: 'center', marginTop: 15 }, topicNumber: { color: '#5862a6', fontWeight: '800', width: 28 }, topicText: { flex: 1, color: '#47516d', fontSize: 15 }, button: { backgroundColor: '#293259', padding: 17, borderRadius: 14, alignItems: 'center', marginTop: 25 }, buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const API = (process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000').replace(/\/$/, '');
export default function App() {
  const list = useRef(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('Todas');
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function request(path, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(API + path, { ...options, headers: { 'Content-Type': 'application/json' }, signal: controller.signal });
      if (response.status === 204) return null;
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo guardar.');
      return data;
    } catch (err) {
      if (err.name === 'AbortError' || err.message === 'Network request failed') throw new Error('No hay conexión con el servidor. Revisa que la API esté encendida y la dirección sea correcta.');
      throw err;
    } finally { clearTimeout(timer); }
  }
  async function load() {
    setLoading(true); setError('');
    try { setTasks(await request('/tasks')); } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  function reset() { setTitle(''); setSubject(''); setEditing(null); }
  async function mutate(action) {
    if (busy) return;
    setBusy(true); setError('');
    try { await action(); } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  function save() {
    if (!title.trim() || !subject.trim()) { setError('Completa la materia y el título.'); return; }
    mutate(async () => {
      const data = await request(editing ? '/tasks/' + editing._id : '/tasks', { method: editing ? 'PUT' : 'POST', body: JSON.stringify({ title, subject, completed: editing?.completed ?? false }) });
      setTasks(old => editing ? old.map(t => t._id === data._id ? data : t) : [data, ...old]); reset();
    });
  }
  function toggle(task) { mutate(async () => {
    const updated = await request('/tasks/' + task._id, { method: 'PUT', body: JSON.stringify({ ...task, completed: !task.completed }) });
    setTasks(old => old.map(t => t._id === task._id ? updated : t));
    if (editing?._id === task._id) setEditing(updated);
  }); }
  function remove(task) {
    Alert.alert('Eliminar tarea', '¿Eliminar “' + task.title + '”?', [{ text: 'Cancelar', style: 'cancel' }, { text: 'Eliminar', style: 'destructive', onPress: () => mutate(async () => {
      await request('/tasks/' + task._id, { method: 'DELETE' });
      setTasks(old => old.filter(t => t._id !== task._id)); if (editing?._id === task._id) reset();
    }) }]);
  }
  const done = tasks.filter(t => t.completed).length;
  const visible = tasks.filter(t => filter === 'Todas' || (filter === 'Listas' ? t.completed : !t.completed));
  const button = (label, action, secondary = false) => <Pressable accessibilityRole="button" disabled={busy || loading} onPress={action} style={[s.button, secondary && s.secondary, (busy || loading) && { opacity: .5 }]}><Text style={secondary ? s.secondaryText : s.buttonText}>{label}</Text></Pressable>;
  return <SafeAreaView style={s.page}><StatusBar style="dark"/><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <FlatList ref={list} data={visible} keyExtractor={t => t._id} refreshing={loading} onRefresh={busy ? undefined : load} keyboardShouldPersistTaps="handled" contentContainerStyle={s.content}
      ListHeaderComponent={<>
        <Text style={s.eyebrow}>JUNIOR / AGENDA ESCOLAR</Text><Text style={s.heading}>Un pendiente menos.</Text><Text style={s.subtitle}>Organiza tus materias, avanza a tu ritmo.</Text>
        <View style={s.stats}><Text style={s.stat}>{tasks.length - done} pendientes</Text><Text style={s.stat}>{done} completadas</Text></View>
        <View style={s.card}><Text style={s.cardTitle}>{editing ? 'Editar tarea' : 'Tu siguiente tarea'}</Text>
          <Text style={s.label}>Materia</Text><TextInput accessibilityLabel="Materia" editable={!busy} style={s.input} value={subject} onChangeText={setSubject} placeholder="Ej. Aplicaciones móviles" maxLength={60}/>
          <Text style={s.label}>¿Qué necesitas hacer?</Text><TextInput accessibilityLabel="Título de la tarea" editable={!busy} style={s.input} value={title} onChangeText={setTitle} placeholder="Ej. Entregar práctica de MongoDB" maxLength={120}/>
          {button(busy ? 'Guardando…' : editing ? 'Guardar cambios' : '+ Agregar tarea', save)}{editing && button('Cancelar edición', reset, true)}
        </View>
        {!!error && <View accessibilityRole="alert" style={s.error}><Text style={{ color: '#8a2436' }}>{error}</Text>{button('Reintentar conexión', load, true)}</View>}
        <View style={s.tabs}>{['Todas', 'Pendientes', 'Listas'].map(f => <Pressable accessibilityRole="button" accessibilityState={{ selected: filter === f }} key={f} onPress={() => setFilter(f)} style={[s.tab, filter === f && s.active]}><Text style={{ color: filter === f ? '#fff' : '#304258' }}>{f}</Text></Pressable>)}</View>
      </>}
      ListEmptyComponent={<Text style={s.empty}>{loading ? 'Cargando tareas…' : error ? 'Conecta el servidor para consultar tus tareas.' : 'No hay tareas aquí. Agrega una para empezar.'}</Text>}
      renderItem={({ item }) => <View style={s.card}><Text style={s.eyebrow}>{item.subject}</Text><Text style={[s.taskTitle, item.completed && s.completed]}>{item.title}</Text><Text style={s.subtitle}>{item.completed ? 'Completada' : 'Pendiente'}</Text>
        {button(item.completed ? 'Marcar pendiente' : '✓ Completar', () => toggle(item))}
        <View style={s.actions}>{button('Editar', () => { setEditing(item); setTitle(item.title); setSubject(item.subject); list.current?.scrollToOffset({ offset: 0, animated: true }); }, true)}{button('Eliminar', () => remove(item), true)}</View>
      </View>}/>
  </KeyboardAvoidingView></SafeAreaView>;
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f4f1ea', paddingTop: Platform.OS === 'android' ? 32 : 0 }, content: { padding: 22, paddingBottom: 60 },
  eyebrow: { color: '#52634b', fontSize: 12, fontWeight: '800', letterSpacing: 1.2 }, heading: { fontSize: 34, fontWeight: '800', color: '#213347', marginVertical: 12 }, subtitle: { color: '#657082', lineHeight: 22 },
  stats: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#dce6d4', padding: 18, borderRadius: 18, marginVertical: 22 }, stat: { color: '#304829', fontWeight: '700' },
  card: { padding: 20, borderRadius: 22, backgroundColor: '#fff', marginBottom: 16, borderWidth: 1, borderColor: '#e6e4df' }, cardTitle: { fontSize: 20, fontWeight: '700', color: '#213347', marginBottom: 8 }, label: { color: '#47566a', marginVertical: 8 },
  input: { padding: 14, backgroundColor: '#f4f5f7', borderRadius: 12, fontSize: 16, color: '#213347', marginBottom: 10 },
  button: { backgroundColor: '#213347', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 10 }, buttonText: { color: '#fff', fontWeight: '700' }, secondary: { backgroundColor: '#edf0f4' }, secondaryText: { color: '#304258', fontWeight: '600' },
  tabs: { flexDirection: 'row', gap: 8, marginBottom: 18 }, tab: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: 24, backgroundColor: '#e6e4df' }, active: { backgroundColor: '#213347' }, taskTitle: { color: '#213347', fontWeight: '700', fontSize: 20, marginVertical: 10 }, completed: { textDecorationLine: 'line-through', color: '#748075' }, actions: { flexDirection: 'row', justifyContent: 'space-between' }, error: { padding: 16, backgroundColor: '#ffe5e8', borderRadius: 14, marginBottom: 16 }, empty: { color: '#657082', textAlign: 'center', padding: 24 }
});

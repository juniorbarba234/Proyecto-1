import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function ConsultarProductos({ onVolver }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const consultar = async () => {
    setCargando(true);
    const { data, error } = await supabase.from('productos').select('*').order('created_at', { ascending: false });
    if (error) Alert.alert('Error al consultar', error.message); else setProductos(data ?? []);
    setCargando(false);
  };
  useEffect(() => { consultar(); }, []);

  return <View style={styles.contenedor}>
    <Text style={styles.titulo}>Consultar productos</Text>
    <Pressable style={styles.recargar} onPress={consultar}><Text style={styles.recargarTexto}>Volver a consultar</Text></Pressable>
    {cargando ? <ActivityIndicator color="#3ecf8e" size="large" /> : <FlatList data={productos} keyExtractor={(item) => String(item.id)} ListEmptyComponent={<Text style={styles.vacio}>No hay productos.</Text>} renderItem={({ item }) => <View style={styles.tarjeta}><Text style={styles.nombre}>{item.producto} — ${Number(item.precio).toFixed(2)}</Text><Text style={styles.descripcion}>{item.descripcion}</Text></View>} />}
    <Pressable style={styles.volver} onPress={onVolver}><Text>Volver al menú</Text></Pressable>
  </View>;
}

const styles = StyleSheet.create({ contenedor: { flex: 1, padding: 18 }, titulo: { fontSize: 21, fontWeight: '800', color: '#102c25', marginBottom: 12 }, recargar: { padding: 12, borderRadius: 10, backgroundColor: '#3ecf8e', alignItems: 'center', marginBottom: 12 }, recargarTexto: { fontWeight: '800', color: '#06281f' }, tarjeta: { padding: 15, borderRadius: 12, backgroundColor: '#fff', marginBottom: 9, borderWidth: 1, borderColor: '#e0eae7' }, nombre: { fontWeight: '800', color: '#102c25' }, descripcion: { color: '#687a74', marginTop: 5 }, vacio: { textAlign: 'center', marginTop: 30 }, volver: { minHeight: 45, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e7eeeb', borderRadius: 10, marginTop: 8 } });

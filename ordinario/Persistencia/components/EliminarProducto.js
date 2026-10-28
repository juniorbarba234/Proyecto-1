import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function EliminarProducto({ onVolver }) {
  const [productos, setProductos] = useState([]);
  const consultar = async () => { const { data, error } = await supabase.from('productos').select('*').order('created_at', { ascending: false }); if (error) Alert.alert('Error', error.message); else setProductos(data ?? []); };
  useEffect(() => { consultar(); }, []);
  const confirmar = (item) => Alert.alert('Eliminar producto', `¿Eliminar ${item.producto}?`, [{ text: 'Cancelar', style: 'cancel' }, { text: 'Eliminar', style: 'destructive', onPress: async () => { const { error } = await supabase.from('productos').delete().eq('id', item.id); if (error) Alert.alert('Error al eliminar', error.message); else { Alert.alert('Correcto', 'Producto eliminado.'); consultar(); } } }]);

  return <View style={styles.contenedor}>
    <Text style={styles.titulo}>Eliminar producto</Text>
    <FlatList data={productos} keyExtractor={(item) => String(item.id)} ListEmptyComponent={<Text>No hay productos.</Text>} renderItem={({ item }) => <View style={styles.tarjeta}><View><Text style={styles.nombre}>{item.producto}</Text><Text>${Number(item.precio).toFixed(2)}</Text></View><Pressable style={styles.eliminar} onPress={() => confirmar(item)}><Text style={styles.eliminarTexto}>Eliminar</Text></Pressable></View>} />
    <Pressable style={styles.volver} onPress={onVolver}><Text>Volver al menú</Text></Pressable>
  </View>;
}

const styles = StyleSheet.create({ contenedor: { flex: 1, padding: 18 }, titulo: { fontSize: 21, fontWeight: '800', color: '#102c25', marginBottom: 14 }, tarjeta: { padding: 15, borderRadius: 11, backgroundColor: '#fff', marginBottom: 9, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, nombre: { fontWeight: '800', color: '#102c25' }, eliminar: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 9, backgroundColor: '#fde7e7' }, eliminarTexto: { color: '#b42318', fontWeight: '800' }, volver: { minHeight: 45, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e7eeeb', borderRadius: 10, marginTop: 8 } });

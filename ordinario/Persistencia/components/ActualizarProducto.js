import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function ActualizarProducto({ onVolver }) {
  const [productos, setProductos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [nombre, setNombre] = useState(''); const [descripcion, setDescripcion] = useState(''); const [precio, setPrecio] = useState('');
  const consultar = async () => { const { data, error } = await supabase.from('productos').select('*').order('created_at', { ascending: false }); if (error) Alert.alert('Error', error.message); else setProductos(data ?? []); };
  useEffect(() => { consultar(); }, []);
  const elegir = (item) => { setSeleccionado(item); setNombre(item.producto); setDescripcion(item.descripcion); setPrecio(String(item.precio)); };
  const actualizar = async () => {
    const valor = Number(precio.replace(',', '.'));
    if (!nombre.trim() || !descripcion.trim() || Number.isNaN(valor)) { Alert.alert('Datos inválidos'); return; }
    const { error } = await supabase.from('productos').update({ producto: nombre.trim(), descripcion: descripcion.trim(), precio: valor }).eq('id', seleccionado.id);
    if (error) Alert.alert('Error al actualizar', error.message); else { Alert.alert('Correcto', 'Producto actualizado.'); setSeleccionado(null); consultar(); }
  };

  return <View style={styles.contenedor}>
    <Text style={styles.titulo}>Actualizar producto</Text>
    {seleccionado ? <View><TextInput style={styles.input} value={nombre} onChangeText={setNombre} /><TextInput style={styles.input} value={descripcion} onChangeText={setDescripcion} /><TextInput style={styles.input} value={precio} onChangeText={setPrecio} keyboardType="decimal-pad" /><Pressable style={styles.principal} onPress={actualizar}><Text style={styles.principalTexto}>Guardar actualización</Text></Pressable><Pressable style={styles.secundario} onPress={() => setSeleccionado(null)}><Text>Elegir otro</Text></Pressable></View> : <FlatList data={productos} keyExtractor={(item) => String(item.id)} ListEmptyComponent={<Text>No hay productos.</Text>} renderItem={({ item }) => <Pressable style={styles.tarjeta} onPress={() => elegir(item)}><Text style={styles.nombre}>{item.producto}</Text><Text>Seleccionar para actualizar</Text></Pressable>} />}
    <Pressable style={styles.volver} onPress={onVolver}><Text>Volver al menú</Text></Pressable>
  </View>;
}

const styles = StyleSheet.create({ contenedor: { flex: 1, padding: 18 }, titulo: { fontSize: 21, fontWeight: '800', color: '#102c25', marginBottom: 14 }, tarjeta: { padding: 15, borderRadius: 11, backgroundColor: '#fff', marginBottom: 9 }, nombre: { fontWeight: '800', color: '#102c25' }, input: { minHeight: 49, borderWidth: 1, borderColor: '#d9e5e1', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 12, marginBottom: 10 }, principal: { minHeight: 48, borderRadius: 10, backgroundColor: '#3ecf8e', alignItems: 'center', justifyContent: 'center' }, principalTexto: { fontWeight: '800' }, secundario: { minHeight: 43, alignItems: 'center', justifyContent: 'center', marginTop: 8 }, volver: { minHeight: 45, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e7eeeb', borderRadius: 10, marginTop: 8 } });

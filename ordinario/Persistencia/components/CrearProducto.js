import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function CrearProducto({ onVolver }) {
  const [producto, setProducto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');

  const crear = async () => {
    const valor = Number(precio.replace(',', '.'));
    if (!producto.trim() || !descripcion.trim() || !precio.trim() || Number.isNaN(valor)) {
      Alert.alert('Datos incompletos', 'Completa correctamente los tres campos.'); return;
    }
    const { error } = await supabase.from('productos').insert({ producto: producto.trim(), descripcion: descripcion.trim(), precio: valor });
    if (error) Alert.alert('Error al crear', error.message);
    else { setProducto(''); setDescripcion(''); setPrecio(''); Alert.alert('Correcto', 'Producto creado.'); }
  };

  return <View style={styles.contenedor}>
    <Text style={styles.titulo}>Crear producto</Text>
    <TextInput style={styles.input} placeholder="Producto" value={producto} onChangeText={setProducto} />
    <TextInput style={styles.input} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} />
    <TextInput style={styles.input} placeholder="Precio" value={precio} onChangeText={setPrecio} keyboardType="decimal-pad" />
    <Pressable style={styles.principal} onPress={crear}><Text style={styles.principalTexto}>Crear</Text></Pressable>
    <Pressable style={styles.volver} onPress={onVolver}><Text>Volver al menú</Text></Pressable>
  </View>;
}

const styles = StyleSheet.create({ contenedor: { margin: 18, padding: 18, borderRadius: 16, backgroundColor: '#fff', elevation: 3 }, titulo: { fontSize: 21, fontWeight: '800', color: '#102c25', marginBottom: 15 }, input: { minHeight: 50, borderWidth: 1, borderColor: '#d9e5e1', borderRadius: 10, paddingHorizontal: 12, marginBottom: 11 }, principal: { minHeight: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#3ecf8e' }, principalTexto: { fontWeight: '800', color: '#06281f' }, volver: { minHeight: 45, alignItems: 'center', justifyContent: 'center', marginTop: 10, backgroundColor: '#e7eeeb', borderRadius: 10 } });

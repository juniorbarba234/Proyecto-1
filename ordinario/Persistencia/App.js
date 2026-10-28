import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import CrearProducto from './components/CrearProducto';
import ConsultarProductos from './components/ConsultarProductos';
import ActualizarProducto from './components/ActualizarProducto';
import EliminarProducto from './components/EliminarProducto';

export default function App() {
  const [pantalla, setPantalla] = useState('menu');

  const contenido = {
    crear: <CrearProducto onVolver={() => setPantalla('menu')} />,
    consultar: <ConsultarProductos onVolver={() => setPantalla('menu')} />,
    actualizar: <ActualizarProducto onVolver={() => setPantalla('menu')} />,
    eliminar: <EliminarProducto onVolver={() => setPantalla('menu')} />,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Persistencia</Text>
          <Text style={styles.estado}>CRUD de productos con Supabase</Text>
        </View>

        {pantalla === 'menu' ? (
          <View style={styles.menu}>
            <Text style={styles.instruccion}>Selecciona una operación</Text>
            <Pressable style={styles.boton} onPress={() => setPantalla('crear')}><Text style={styles.botonTexto}>Crear producto</Text></Pressable>
            <Pressable style={styles.boton} onPress={() => setPantalla('consultar')}><Text style={styles.botonTexto}>Consultar productos</Text></Pressable>
            <Pressable style={styles.boton} onPress={() => setPantalla('actualizar')}><Text style={styles.botonTexto}>Actualizar producto</Text></Pressable>
            <Pressable style={[styles.boton, styles.botonEliminar]} onPress={() => setPantalla('eliminar')}><Text style={[styles.botonTexto, styles.textoEliminar]}>Eliminar producto</Text></Pressable>
          </View>
        ) : contenido[pantalla]}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#071b17' }, container: { flex: 1, backgroundColor: '#f2f7f5' },
  header: { backgroundColor: '#071b17', paddingHorizontal: 22, paddingTop: 24, paddingBottom: 24 },
  title: { color: '#fff', fontSize: 30, fontWeight: '800' }, estado: { color: '#bdd0c9', fontSize: 14, marginTop: 8 },
  menu: { padding: 22 }, instruccion: { fontSize: 20, fontWeight: '700', color: '#102c25', marginBottom: 20 },
  boton: { minHeight: 58, borderRadius: 13, justifyContent: 'center', paddingHorizontal: 18, backgroundColor: '#3ecf8e', marginBottom: 14 },
  botonTexto: { color: '#06281f', fontSize: 17, fontWeight: '800' }, botonEliminar: { backgroundColor: '#fde7e7' }, textoEliminar: { color: '#b42318' },
});

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import MiComponente from './componentes/MiComponente';
import Mensaje from './componentes/Mensaje';

export default function App() {
  return (
    <View style={styles.container}>
      <MiComponente />
      <Mensaje />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
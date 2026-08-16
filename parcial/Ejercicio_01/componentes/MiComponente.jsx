import { View, Text, StyleSheet } from 'react-native';

export default function MiComponente() {
  return (
    <View>
      <Text style={styles.color_texto}>
        Hola desde mi componente
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  color_texto: {
    color: 'red',
  },
});
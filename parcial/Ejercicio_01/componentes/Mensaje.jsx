import { View, Text } from 'react-native';

const mitexto = "Mensaje desde un objeto";
const num = 22;

export default function Mensaje() {
  return (
    <View>
      <Text>{mitexto + " " + num}</Text>
    </View>
  );
}
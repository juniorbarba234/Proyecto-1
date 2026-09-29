# DynamicFlatlist — Campus Cursos

Práctica React Native con Expo: FlatList de cinco cursos, tarjetas con título, duración y calificación, selección con estado y Modal de detalles. Incluye búsqueda sin distinción de acentos, estado vacío y cierre con botón o botón Atrás de Android. Los cursos y calificaciones son datos de ejemplo.

## Ejecutar

Desde esta carpeta, con Node y Expo Go compatible con SDK 57:

```cmd
npm install
npx expo start --tunnel
```

Escanea el QR con Expo Go. No requiere servidor ni MongoDB.

## Comprobar

Abre una tarjeta y verifica que los detalles correspondan al curso. Cierra la ventana, busca «moviles», prueba una búsqueda sin coincidencias y pulsa «Ver todos los cursos».

```cmd
npx expo export --platform android
npx expo export --platform ios
```

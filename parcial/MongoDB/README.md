# Agenda Escolar — MongoDB

Ejercicio original: aplicación React Native / Expo y API Express conectada a MongoDB Atlas.
Permite agregar, consultar, editar, completar, reabrir y eliminar tareas, con filtros y contadores.

## Requisitos

Node 24, npm, Expo Go compatible con SDK 57 o emulador Android. Atlas activo y la IP del servidor autorizada.

## Preparación (CMD, desde esta carpeta)

```cmd
npm install
npm --prefix API install
copy API\.env.example API\.env
copy .env.example .env
code API\.env
```

En `API/.env`, sustituye REEMPLAZA_LOCALMENTE por tu contraseña NUEVA de Atlas. No la compartas ni la subas al repositorio. Si contiene caracteres reservados de URI, codifícalos con percent-encoding. La contraseña compartida anteriormente debe cambiarse en Atlas (Database Access).

Usa preferentemente un usuario con permiso readWrite solamente sobre agenda_escolar, no atlasAdmin.
El servidor crea la colección tasks al utilizarla; no hay que crear documentos manualmente en Atlas.

## Ejecutar

Terminal 1, desde esta carpeta:

```cmd
npm run api
```

Debe aparecer “MongoDB conectado”. Terminal 2:

```cmd
npx expo start
```

Presiona `a` para el emulador o escanea el QR con Expo Go.
La dirección de `.env` es `http://10.0.2.2:3000` para el emulador Android estándar.
Para un teléfono real, usa `ipconfig` en la computadora y cambia EXPO_PUBLIC_API_URL por `http://IP_LOCAL_DE_TU_PC:3000`. Ambos deben estar en la misma red y el firewall permitir Node en red privada. Reinicia Expo después de modificar `.env`.

El túnel de Expo NO publica la API. No uses un túnel público para esta API sin añadir autenticación primero. Este ejercicio es una demo local de un solo usuario: cualquiera con acceso a la API puede modificar sus tareas. La laptop y el servidor deben seguir encendidos para usarla. Atlas no aloja el servidor Node.

## Verificación

```cmd
npm test
npx expo export --platform android
```

Las pruebas HTTP utilizan una colección simulada; no prueban Atlas. Para la prueba real: crea una tarea, edítala, márcala completada, reinicia la app y verifica que persiste; después elimínala. Comprueba también `agenda_escolar.tasks` en Atlas.

## Arquitectura

App.js → API HTTP `/tasks` → MongoDB Atlas. Solo la URL de la API se incluye en Expo. La URI y contraseña de Atlas permanecen en API/.env, ignorado por Git.

Referencias oficiales: https://docs.expo.dev/guides/environment-variables/ y https://www.mongodb.com/docs/drivers/node/current/reference/quick-reference/

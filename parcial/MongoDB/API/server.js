import { MongoClient } from 'mongodb';
import { createApp } from './app.js';

const uri = process.env.MONGODB_URI;
if (!uri || uri.includes('REEMPLAZA') || uri.includes('<db_password>')) {
  console.error('Configura MONGODB_URI en API/.env con tu contraseña privada. Consulta README.md.');
  process.exit(1);
}
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
try {
  await client.connect();
  await client.db().command({ ping: 1 });
  const tasks = client.db(process.env.MONGODB_DB || 'agenda_escolar').collection('tasks');
  await tasks.createIndex({ createdAt: -1 });
  const server = createApp(tasks).listen(Number(process.env.PORT || 3000), '0.0.0.0', () => {
    console.log('MongoDB conectado. API disponible en el puerto ' + (process.env.PORT || 3000));
  });
  async function close() { server.close(); await client.close(); process.exit(0); }
  process.on('SIGINT', close);
  process.on('SIGTERM', close);
  server.on('error', async () => { console.error('No se pudo abrir el puerto de la API.'); await client.close(); process.exit(1); });
} catch {
  console.error('No se pudo conectar a Atlas. Revisa contraseña, IP autorizada y estado del clúster.');
  await client.close();
  process.exit(1);
}

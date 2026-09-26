import express from 'express';
import { ObjectId } from 'mongodb';

export function createApp(tasks) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '16kb' }));
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.param('id', (req, res, next, id) => {
    if (!/^[a-f\d]{24}$/i.test(id)) return res.status(400).json({ error: 'Identificador inválido.' });
    req.taskId = new ObjectId(id);
    next();
  });
  function validate(req, res, next) {
    const { title, subject, completed } = req.body || {};
    if (typeof title !== 'string' || !title.trim() || title.trim().length > 120 ||
        typeof subject !== 'string' || !subject.trim() || subject.trim().length > 60 ||
        (completed !== undefined && typeof completed !== 'boolean')) {
      return res.status(400).json({ error: 'Escribe un título (1–120 caracteres) y una materia (1–60).' });
    }
    req.task = { title: title.trim(), subject: subject.trim(), completed: completed ?? false };
    next();
  }
  app.get('/tasks', async (_req, res) => res.json(await tasks.find().sort({ createdAt: -1 }).toArray()));
  app.post('/tasks', validate, async (req, res) => {
    const task = { ...req.task, createdAt: new Date() };
    const { insertedId } = await tasks.insertOne(task);
    res.status(201).json({ ...task, _id: insertedId });
  });
  app.put('/tasks/:id', validate, async (req, res) => {
    const task = await tasks.findOneAndUpdate({ _id: req.taskId }, { $set: req.task }, { returnDocument: 'after' });
    if (!task) return res.status(404).json({ error: 'La tarea ya no existe.' });
    res.json(task);
  });
  app.delete('/tasks/:id', async (req, res) => {
    const result = await tasks.deleteOne({ _id: req.taskId });
    if (!result.deletedCount) return res.status(404).json({ error: 'La tarea ya no existe.' });
    res.status(204).end();
  });
  app.use((err, _req, res, _next) => {
    res.status(err.status === 400 ? 400 : 500).json({ error: err.status === 400 ? 'JSON inválido.' : 'No se pudo acceder a la base de datos. Intenta nuevamente.' });
  });
  return app;
}

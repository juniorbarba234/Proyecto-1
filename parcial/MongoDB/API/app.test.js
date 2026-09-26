import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ObjectId } from 'mongodb';
import { createApp } from './app.js';

test('CRUD HTTP y validación con colección simulada (no Atlas)', async () => {
  let rows = [];
  const collection = {
    find: () => ({ sort: () => ({ toArray: async () => rows }) }),
    insertOne: async task => { const _id = new ObjectId(); rows.push({ ...task, _id }); return { insertedId: _id }; },
    findOneAndUpdate: async (query, update) => {
      const row = rows.find(t => t._id.equals(query._id));
      if (!row) return null; Object.assign(row, update.$set); return row;
    },
    deleteOne: async query => { const before = rows.length; rows = rows.filter(t => !t._id.equals(query._id)); return { deletedCount: before - rows.length }; }
  };
  const server = createApp(collection).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const url = 'http://127.0.0.1:' + server.address().port;
  const send = (path, method = 'GET', body) => fetch(url + path, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  try {
    assert.equal((await send('/health')).status, 200);
    assert.equal((await send('/tasks', 'POST', { title: '', subject: 'A' })).status, 400);
    assert.equal((await send('/tasks', 'POST', { title: 'A', subject: 'B', completed: 'yes' })).status, 400);
    const created = await send('/tasks', 'POST', { title: ' Estudiar ', subject: 'Móviles' });
    assert.equal(created.status, 201); const task = await created.json();
    assert.equal(task.title, 'Estudiar'); assert.equal(task.completed, false);
    assert.equal((await (await send('/tasks')).json()).length, 1);
    const edited = await send('/tasks/' + task._id, 'PUT', { title: 'Entregar', subject: 'MongoDB', completed: true });
    assert.equal((await edited.json()).completed, true);
    assert.equal((await send('/tasks/bad', 'DELETE')).status, 400);
    assert.equal((await send('/tasks/' + new ObjectId(), 'PUT', { title: 'A', subject: 'B' })).status, 404);
    assert.equal((await send('/tasks/' + task._id, 'DELETE')).status, 204);
    assert.equal((await send('/tasks/' + task._id, 'DELETE')).status, 404);
    assert.deepEqual(await (await send('/tasks')).json(), []);
    collection.find = () => { throw new Error('private connection details'); };
    const failed = await send('/tasks'); assert.equal(failed.status, 500);
    assert.ok(!(await failed.text()).includes('private'));
  } finally { await new Promise(resolve => server.close(resolve)); }
});

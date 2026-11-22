
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { createApp } = require('../src/app');

let server;
let base;

before(async () => {
  server = createApp().listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

test('registo da atividade tem os cinco URL', async () => {
  const body = await (await fetch(`${base}/registo.json`)).json();
  for (const k of ['name', 'config_url', 'json_params_url', 'user_url', 'analytics_url', 'analytics_list_url']) {
    assert.ok(body[k], `falta ${k}`);
  }
});

test('config_url devolve HTML com os campos de json_params', async () => {
  const res = await fetch(`${base}/configuracao-atividade.html`);
  assert.match(res.headers.get('content-type'), /text\/html/);
  const html = await res.text();
  const params = await (await fetch(`${base}/json-params-atividade`)).json();
  for (const p of params) assert.ok(html.includes(`name="${p.name}"`), `campo ${p.name} em falta na página`);
});

test('json_params_url devolve lista de {name,type}', async () => {
  const params = await (await fetch(`${base}/json-params-atividade`)).json();
  assert.ok(Array.isArray(params) && params.length > 0);
  for (const p of params) assert.deepStrictEqual(Object.keys(p).sort(), ['name', 'type']);
});

test('user_url (deploy) devolve URL da atividade', async () => {
  const res = await fetch(`${base}/deploy-atividade?activityID=abc123`);
  assert.strictEqual(res.status, 200);
  const url = await res.text();
  assert.match(url, /\/atividade\/abc123$/);
  assert.strictEqual((await fetch(`${base}/deploy-atividade`)).status, 400);
});

test('analytics_list_url devolve qual e quant', async () => {
  const body = await (await fetch(`${base}/lista-analytics-atividade`)).json();
  assert.ok(Array.isArray(body.qualAnalytics) && Array.isArray(body.quantAnalytics));
});

test('analytics_url (POST) devolve analytics por aluno, coerentes com a lista', async () => {
  const list = await (await fetch(`${base}/lista-analytics-atividade`)).json();
  const res = await fetch(`${base}/analytics-atividade`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ activityID: 'abc123' })
  });
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.ok(data.length > 0);
  for (const s of data) {
    assert.ok(s.inveniraStdID);
    assert.deepStrictEqual(s.quantAnalytics.map((a) => a.name), list.quantAnalytics.map((a) => a.name));
    assert.deepStrictEqual(s.qualAnalytics.map((a) => a.name), list.qualAnalytics.map((a) => a.name));
  }
  const bad = await fetch(`${base}/analytics-atividade`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{oops'
  });
  assert.strictEqual(bad.status, 400);
});

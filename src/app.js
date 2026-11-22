const express = require('express');
const cors = require('cors');
const { BASE_URL } = require('./config');
const { ACTIVITY_NAME, CONFIG_PARAMS, ANALYTICS } = require('./activity');
const { renderConfigPage } = require('./configPage');
const store = require('./store');
const { sampleAnalytics } = require('./sampleData');

const MAX_ID_LENGTH = 200;

function readActivityID(req) {
  const raw = (req.body && req.body.activityID) ?? req.query.activityID ?? req.params.activityID;
  if (typeof raw !== 'string' && typeof raw !== 'number') return null;
  const id = String(raw).trim();
  if (!id || id.length > MAX_ID_LENGTH) return null;
  return id;
}

function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(cors());
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: false, limit: '100kb' }));

  app.get(['/', '/registo.json'], (req, res) => {
    res.json({
      name: ACTIVITY_NAME,
      config_url: `${BASE_URL}/configuracao-atividade.html`,
      json_params_url: `${BASE_URL}/json-params-atividade`,
      user_url: `${BASE_URL}/deploy-atividade`,
      analytics_url: `${BASE_URL}/analytics-atividade`,
      analytics_list_url: `${BASE_URL}/lista-analytics-atividade`
    });
  });

  // 1. config_url - página de configuração (HTML)
  app.get('/configuracao-atividade.html', (req, res) => {
    res.type('html').send(renderConfigPage());
  });

  // 2. json_params_url - parâmetros a recolher da página de configuração
  app.get('/json-params-atividade', (req, res) => {
    res.json(CONFIG_PARAMS);
  });

  // 3. user_url - deploy de uma instância da atividade
  const deploy = (req, res) => {
    const activityID = readActivityID(req);
    if (!activityID) {
      return res.status(400).json({ error: 'Parâmetro "activityID" em falta ou inválido.' });
    }
    store.createInstance(activityID);
    const url = `${BASE_URL}/atividade/${encodeURIComponent(activityID)}`;
    res.type('text/plain').send(url);
  };
  app.get('/deploy-atividade', deploy);
  app.get('/deploy-atividade/:activityID', deploy);
  app.post('/deploy-atividade', deploy);

  // 4. analytics_list_url - lista de analytics disponíveis
  app.get('/lista-analytics-atividade', (req, res) => {
    res.json(ANALYTICS);
  });

  // 5. analytics_url - analytics de todos os alunos de uma instância (POST {activityID})
  app.post('/analytics-atividade', (req, res) => {
    const activityID = readActivityID(req);
    if (!activityID) {
      return res.status(400).json({ error: 'Parâmetro "activityID" em falta ou inválido.' });
    }
    res.json(sampleAnalytics(activityID));
  });

  // 6. Provide activity - ainda não implementado nesta fase do projeto.
  app.all('/atividade/:activityID', (req, res) => {
    res.status(501).json({ error: 'Provide activity ainda não implementado nesta fase.' });
  });


  app.get('/health', (req, res) => res.json({ status: 'ok' }));


  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Corpo JSON inválido.' });
    }
    if (err.type === 'entity.too.large') {
      return res.status(413).json({ error: 'Pedido demasiado grande.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Erro interno.' });
  });

  app.use((req, res) => res.status(404).json({ error: 'Recurso não encontrado.' }));

  return app;
}

module.exports = { createApp };

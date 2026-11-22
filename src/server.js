const { createApp } = require('./app');
const { PORT, BASE_URL } = require('./config');

createApp().listen(PORT, () => {
  console.log(`LimpaDados Activity Provider a correr na porta ${PORT}`);
  console.log(`Registo da atividade: ${BASE_URL}/registo.json`);
});

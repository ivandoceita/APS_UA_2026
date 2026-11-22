const { BASE_URL } = require('./config');

function seededRandom(seedText) {
  let h = 2166136261;
  for (const ch of String(seedText)) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}

function sampleAnalytics(activityID, nStudents = 3) {
  const rnd = seededRandom(activityID);
  const int = (min, max) => min + Math.floor(rnd() * (max - min + 1));
  const result = [];

  for (let i = 1; i <= nStudents; i++) {
    const stdID = String(1000 + i);
    const totalErros = 40;
    const corrigidos = int(10, totalErros);
    const incorretas = int(0, 6);
    const porCorrigir = totalErros - corrigidos;
    const percent = Math.round((corrigidos / totalErros) * 100);
    const reportUrl = `${BASE_URL}/relatorio?activityID=${encodeURIComponent(activityID)}&stdID=${stdID}`;

    result.push({
      inveniraStdID: stdID,
      quantAnalytics: [
        { name: 'Acedeu à atividade', type: 'boolean', value: true },
        { name: 'Nº de erros corrigidos', type: 'integer', value: corrigidos },
        { name: 'Nº de erros por corrigir', type: 'integer', value: porCorrigir },
        { name: 'Nº de correções incorretas', type: 'integer', value: incorretas },
        { name: 'Percentagem de limpeza', type: 'integer', value: percent },
        { name: 'Tempo na atividade (s)', type: 'integer', value: int(300, 3600) },
        { name: 'Nº de submissões', type: 'integer', value: int(1, 3) },
        { name: 'Descarregou o dataset', type: 'boolean', value: rnd() > 0.3 }
      ],
      qualAnalytics: [
        { name: 'Relatório de limpeza', type: 'URL', value: reportUrl },
        {
          name: 'Registo de ações',
          type: 'text/plain',
          value: `Removeu ${int(2, 8)} duplicados; imputou ${int(3, 12)} valores em falta; uniformizou ${int(1, 10)} datas.`
        }
      ]
    });
  }
  return result;
}

module.exports = { sampleAnalytics };

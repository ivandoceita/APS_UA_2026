
const { ACTIVITY_NAME, DATASETS, ERROR_TYPES } = require('./activity');

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function renderConfigPage() {
  const datasetOptions = DATASETS
    .map((d) => `<option value="${esc(d.id)}">${esc(d.label)}</option>`)
    .join('\n          ');

  const errorChecks = ERROR_TYPES
    .map((e) => `<label class="check"><input type="checkbox" class="tipo-erro" value="${esc(e.id)}" checked> ${esc(e.label)}</label>`)
    .join('\n        ');

  return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Configuração - ${esc(ACTIVITY_NAME)}</title>
  <style>
    body { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; margin: 0; padding: 1.25rem; color: #1f2933; background: #fff; }
    h1 { font-size: 1.2rem; margin: 0 0 .25rem; }
    p.lead { margin: 0 0 1.25rem; color: #52606d; font-size: .95rem; }
    fieldset { border: 1px solid #d9e2ec; border-radius: 6px; padding: .75rem 1rem; margin: 0 0 1rem; }
    legend { font-weight: 600; padding: 0 .35rem; }
    label { display: block; font-size: .9rem; margin-bottom: .35rem; }
    label.check { display: flex; gap: .5rem; align-items: center; font-weight: normal; }
    select, textarea, input[type=number] { width: 100%; box-sizing: border-box; padding: .45rem; font: inherit; border: 1px solid #bcccdc; border-radius: 4px; }
    textarea { min-height: 6rem; resize: vertical; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    small { color: #7b8794; }
  </style>
</head>
<body>
  <h1>${esc(ACTIVITY_NAME)}</h1>
  <p class="lead">O formando recebe um dataset com erros e deve limpá-lo. Configure a instância da atividade.</p>

  <form id="config-form" onsubmit="return false">
    <fieldset>
      <legend>Dataset</legend>
      <label for="dataset">Dataset a limpar</label>
      <select id="dataset" name="dataset">
          ${datasetOptions}
      </select>
    </fieldset>

    <fieldset>
      <legend>Tipos de erro a tratar</legend>
        ${errorChecks}
      <!-- Valor recolhido pela Inven!RA (lista separada por vírgulas), atualizado pelas caixas acima -->
      <input type="hidden" id="tipos_erro" name="tipos_erro" value="">
    </fieldset>

    <fieldset>
      <legend>Instruções para o formando</legend>
      <label for="instrucoes">Texto apresentado no início da atividade</label>
      <textarea id="instrucoes" name="instrucoes">Analise o dataset, identifique os erros e corrija-os. No fim, submeta o dataset limpo.</textarea>
    </fieldset>

    <fieldset>
      <legend>Regras</legend>
      <div class="row">
        <div>
          <label for="tempo_limite">Tempo limite (minutos)</label>
          <input type="number" id="tempo_limite" name="tempo_limite" min="0" max="600" value="60">
          <small>0 = sem limite</small>
        </div>
        <div>
          <label for="max_submissoes">Nº máximo de submissões</label>
          <input type="number" id="max_submissoes" name="max_submissoes" min="1" max="10" value="3">
        </div>
      </div>
    </fieldset>
  </form>

  <script>
    (function () {
      var hidden = document.getElementById('tipos_erro');
      var boxes = document.querySelectorAll('.tipo-erro');
      function sync() {
        hidden.value = Array.prototype.filter.call(boxes, function (b) { return b.checked; })
          .map(function (b) { return b.value; }).join(',');
      }
      Array.prototype.forEach.call(boxes, function (b) { b.addEventListener('change', sync); });
      sync();
    })();
  </script>
</body>
</html>`;
}

module.exports = { renderConfigPage };

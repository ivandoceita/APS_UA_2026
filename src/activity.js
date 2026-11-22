
const ACTIVITY_NAME = 'LimpaDados - Limpeza de um dataset';

// Campos da página de configuração que a Inven!RA deve recolher (json_params_url).
const CONFIG_PARAMS = [
  { name: 'dataset', type: 'text/plain' },        
  { name: 'instrucoes', type: 'text/plain' },       
  { name: 'tipos_erro', type: 'text/plain' },       
  { name: 'tempo_limite', type: 'integer' },        
  { name: 'max_submissoes', type: 'integer' }       
];

// Opções apresentadas na página de configuração.
const DATASETS = [
  { id: 'censo_agregados', label: 'Recenseamento - agregados familiares (300 registos)' },
  { id: 'precos_mercado', label: 'Preços de produtos em mercados (250 registos)' },
  { id: 'vacinacao', label: 'Registos de vacinação (200 registos)' }
];

const ERROR_TYPES = [
  { id: 'duplicados', label: 'Registos duplicados' },
  { id: 'valores_em_falta', label: 'Valores em falta' },
  { id: 'formatos', label: 'Formatos inconsistentes (datas, números)' },
  { id: 'outliers', label: 'Valores atípicos (outliers)' },
  { id: 'categorias', label: 'Categorias mal codificadas' }
];

// Analytics que o Activity Provider recolhe (analytics_list_url).
const ANALYTICS = {
  qualAnalytics: [
    { name: 'Relatório de limpeza', type: 'URL' },
    { name: 'Registo de ações', type: 'text/plain' }
  ],
  quantAnalytics: [
    { name: 'Acedeu à atividade', type: 'boolean' },
    { name: 'Nº de erros corrigidos', type: 'integer' },
    { name: 'Nº de erros por corrigir', type: 'integer' },
    { name: 'Nº de correções incorretas', type: 'integer' },
    { name: 'Percentagem de limpeza', type: 'integer' },
    { name: 'Tempo na atividade (s)', type: 'integer' },
    { name: 'Nº de submissões', type: 'integer' },
    { name: 'Descarregou o dataset', type: 'boolean' }
  ]
};

module.exports = { ACTIVITY_NAME, CONFIG_PARAMS, DATASETS, ERROR_TYPES, ANALYTICS };

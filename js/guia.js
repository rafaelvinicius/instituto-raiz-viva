/* ==================================================================
   Guia de componentes (componentes.html)
   Página de documentação fora da SPA. Reaproveita os mesmos
   componentes de cabeçalho e rodapé; os links apontam para a SPA
   (index.html#/rota).
   ================================================================== */

import { cabecalho } from './componentes/cabecalho.js';
import { rodape } from './componentes/rodape.js';
import { iniciarMenu } from './interacoes/menu.js';
import { iniciarFeedback } from './interacoes/feedback.js';
import { iniciarAtalhoConteudo } from './interacoes/atalhos.js';

const BASE = 'index.html';

document.documentElement.classList.add('js');

document.getElementById('cabecalho').innerHTML = cabecalho({
  titulo: 'Guia de componentes',
  lema: 'Etiquetas, alertas, toasts e modal usados na plataforma',
  base: BASE
});
document.getElementById('rodape').innerHTML = rodape({ base: BASE });

iniciarMenu();
iniciarFeedback();
iniciarAtalhoConteudo();

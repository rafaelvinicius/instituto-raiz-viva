/* ==================================================================
   Tabela de rotas da SPA: endereço → página
   Para criar uma página nova, basta um arquivo em views/ e uma linha aqui.
   ================================================================== */

import { inicio } from './views/inicio.js';
import { projetos } from './views/projetos.js';
import { cadastro } from './views/cadastro.js';

export { naoEncontrada as paginaNaoEncontrada } from './views/nao-encontrada.js';

export const rotas = {
  '/': inicio,
  '/projetos': projetos,
  '/cadastro': cadastro
};

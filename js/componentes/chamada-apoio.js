/* ==================================================================
   Componente: bloco "Apoie" com chamada para o cadastro
   ================================================================== */

import { escapar } from '../utils/html.js';
import { caminhoPara } from '../roteador.js';

/**
 * @param {boolean} lateral true → ocupa a coluna lateral (variação da página inicial)
 */
export const chamadaApoio = ({ titulo, texto, rotuloBotao, lateral = false }) => `
  <aside class="apoie${lateral ? ' apoie--lateral' : ''}">
    <h2>${escapar(titulo)}</h2>
    <p>${escapar(texto)}</p>
    <p><a class="botao" href="${caminhoPara('/cadastro')}">${escapar(rotuloBotao)}</a></p>
  </aside>`;

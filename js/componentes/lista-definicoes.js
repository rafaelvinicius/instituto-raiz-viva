/* ==================================================================
   Componente: lista de definições (<dl>) em pares termo/valor
   Usado nos números da página inicial, na ficha técnica de cada
   projeto e na tabela de valores de doação.
   ================================================================== */

import { escapar, renderizarLista } from '../utils/html.js';

const par = ({ termo, valor, data }) => {
  const conteudo = data
    ? `<time datetime="${escapar(data)}">${escapar(valor)}</time>`
    : escapar(valor);
  return `<div><dt>${escapar(termo)}</dt> <dd>${conteudo}</dd></div>`;
};

/**
 * @param {Array}  itens  [{ termo, valor, data? }] — `data` gera um <time>
 * @param {string} classe Classe CSS do <dl> ('ficha', 'numeros'...)
 */
export const listaDefinicoes = (itens, classe = 'ficha') => `
  <dl class="${classe}">
    ${renderizarLista(itens, par)}
  </dl>`;

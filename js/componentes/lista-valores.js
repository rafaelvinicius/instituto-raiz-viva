/* ==================================================================
   Componente: lista com marcadores no estilo "lista-valores"
   ================================================================== */

import { escapar, renderizarLista } from '../utils/html.js';

/**
 * @param {string[]} itens    Textos de cada item
 * @param {boolean}  ordenada true → <ol> (passos em sequência)
 */
export const listaValores = (itens, { ordenada = false } = {}) => {
  const tag = ordenada ? 'ol' : 'ul';
  return `
    <${tag} class="lista-valores">
      ${renderizarLista(itens, (item) => `<li>${escapar(item)}</li>`)}
    </${tag}>`;
};

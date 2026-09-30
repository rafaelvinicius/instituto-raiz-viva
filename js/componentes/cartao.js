/* ==================================================================
   Componente: cartão simples (título + texto)
   ================================================================== */

import { escapar } from '../utils/html.js';

export const cartao = ({ titulo, texto }) => `
  <article class="cartao">
    <h3>${escapar(titulo)}</h3>
    <p>${escapar(texto)}</p>
  </article>`;

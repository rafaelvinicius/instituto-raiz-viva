/* ==================================================================
   Componente: figura com imagem WebP e alternativa em JPG
   ================================================================== */

import { escapar } from '../utils/html.js';

/**
 * @param {string}  nome     Nome do arquivo em assets/img, sem extensão
 * @param {string}  alt      Texto alternativo
 * @param {string}  legenda  Conteúdo do figcaption
 * @param {number}  largura  Largura intrínseca (evita salto de layout)
 * @param {number}  altura   Altura intrínseca
 * @param {boolean} adiada   true → loading="lazy" (imagens abaixo da dobra)
 * @param {string}  classe   Classe opcional do <figure>
 */
export const figura = ({ nome, alt, legenda, largura, altura, adiada = false, classe = '' }) => `
  <figure${classe ? ` class="${classe}"` : ''}>
    <picture>
      <source srcset="assets/img/${nome}.webp" type="image/webp">
      <img src="assets/img/${nome}.jpg"
           alt="${escapar(alt)}"
           width="${largura}" height="${altura}"${adiada ? ' loading="lazy"' : ''}>
    </picture>
    <figcaption>${escapar(legenda)}</figcaption>
  </figure>`;

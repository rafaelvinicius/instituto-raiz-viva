/* ==================================================================
   Componente: figura responsiva (AVIF, WebP e JPEG)
   ------------------------------------------------------------------
   Cada foto existe em três larguras (480, 768 e a original) e em três
   formatos. O navegador escolhe:
   - o formato: o primeiro <source> que ele suporta (AVIF → WebP),
     com o JPEG do <img> como alternativa final;
   - a largura: pelo srcset + sizes, conforme o espaço que a imagem
     ocupa na tela e a densidade de pixels do aparelho.
   ================================================================== */

import { escapar } from '../utils/html.js';
import { PASTA_IMAGENS } from '../config.js';

const LARGURAS_MENORES = [480, 768];

// "mutirao-480.webp 480w, mutirao-768.webp 768w, mutirao.webp 960w"
const conjunto = (nome, extensao, larguraOriginal) => [
  ...LARGURAS_MENORES.map((l) => `${PASTA_IMAGENS}/${nome}-${l}.${extensao} ${l}w`),
  `${PASTA_IMAGENS}/${nome}.${extensao} ${larguraOriginal}w`
].join(', ');

/**
 * @param {string}  nome      Nome do arquivo na pasta imagens/, sem extensão e sem largura
 * @param {string}  alt       Texto alternativo
 * @param {string}  legenda   Conteúdo do figcaption
 * @param {number}  largura   Largura do arquivo original (também evita salto de layout)
 * @param {number}  altura    Altura do arquivo original
 * @param {string}  tamanhos  Atributo sizes: largura exibida em cada faixa de tela
 * @param {boolean} adiada    true → loading="lazy" (abaixo da dobra);
 *                            false → fetchpriority="high" (imagem principal da página)
 * @param {string}  classe    Classe opcional do <figure>
 */
export const figura = ({
  nome, alt, legenda, largura, altura,
  tamanhos = '100vw', adiada = false, classe = ''
}) => `
  <figure${classe ? ` class="${classe}"` : ''}>
    <picture>
      <source type="image/avif" srcset="${conjunto(nome, 'avif', largura)}" sizes="${tamanhos}">
      <source type="image/webp" srcset="${conjunto(nome, 'webp', largura)}" sizes="${tamanhos}">
      <img src="${PASTA_IMAGENS}/${nome}.jpg"
           srcset="${conjunto(nome, 'jpg', largura)}" sizes="${tamanhos}"
           alt="${escapar(alt)}"
           width="${largura}" height="${altura}" decoding="async"${adiada ? ' loading="lazy"' : ' fetchpriority="high"'}>
    </picture>
    <figcaption>${escapar(legenda)}</figcaption>
  </figure>`;

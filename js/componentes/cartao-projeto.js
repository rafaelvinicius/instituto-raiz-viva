/* ==================================================================
   Componente: cartão de projeto social
   Reaproveita os componentes de figura e de lista de definições.
   ================================================================== */

import { escapar } from '../utils/html.js';
import { figura } from './figura.js';
import { listaDefinicoes } from './lista-definicoes.js';

export const cartaoProjeto = (projeto) => `
  <article class="projeto" id="${escapar(projeto.id)}">
    <h3>${escapar(projeto.titulo)}</h3>
    <ul class="etiquetas" aria-label="Situação e área do projeto">
      <li class="etiqueta etiqueta--${escapar(projeto.situacao.tipo)}">${escapar(projeto.situacao.texto)}</li>
      <li class="etiqueta">${escapar(projeto.area)}</li>
    </ul>
    ${figura({ ...projeto.imagem, largura: 640, altura: 360, adiada: true })}
    <p>${escapar(projeto.descricao)}</p>
    ${listaDefinicoes(projeto.ficha)}
  </article>`;

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
    ${figura({
      ...projeto.imagem,
      largura: 1000,
      altura: 563,
      // larguras medidas: 1 coluna no celular, foto lateral no tablet, 2 cartões no desktop
      tamanhos: '(min-width: 1024px) 530px, (min-width: 768px) 38vw, calc(100vw - 5rem)',
      adiada: true
    })}
    <p>${escapar(projeto.descricao)}</p>
    ${listaDefinicoes(projeto.ficha)}
  </article>`;

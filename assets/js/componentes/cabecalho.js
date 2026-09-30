/* ==================================================================
   Componente: cabeçalho com marca, título da página e menu principal
   ================================================================== */

import { escapar, renderizarLista } from '../utils/html.js';
import { caminhoPara } from '../roteador.js';
import { navegacao } from '../dados/navegacao.js';

const subitemMenu = (rota, base) => (subitem) => `
  <li><a href="${caminhoPara(rota, subitem.ancora, base)}">${escapar(subitem.rotulo)}</a></li>`;

const itemMenu = (rotaAtual, base) => (item) => {
  const atual = item.rota === rotaAtual ? ' aria-current="page"' : '';
  const link = `<a href="${caminhoPara(item.rota, null, base)}"${atual}>${escapar(item.rotulo)}</a>`;

  if (!item.subitens) {
    return `<li>${link}</li>`;
  }

  return `
    <li class="menu__item--sub">
      ${link}
      <ul class="submenu">${renderizarLista(item.subitens, subitemMenu(item.rota, base))}</ul>
    </li>`;
};

/**
 * @param {string} titulo    Texto do h1 da página
 * @param {string} lema      Subtítulo abaixo do h1
 * @param {string} rotaAtual Rota ativa, marcada com aria-current no menu
 * @param {string} base      Prefixo dos links ('' dentro da SPA, 'index.html' fora dela)
 */
export const cabecalho = ({ titulo, lema, rotaAtual = null, base = '' }) => `
  <div class="cabecalho__marca">
    <img src="assets/img/logo-raiz-viva.png" alt="Instituto Raiz Viva" width="56" height="56">
    <div>
      <h1 tabindex="-1">${escapar(titulo)}</h1>
      <p class="cabecalho__lema">${escapar(lema)}</p>
    </div>
  </div>

  <nav class="menu" aria-label="Navegação principal">
    <button class="menu__botao" type="button" aria-expanded="false" aria-controls="menu-lista">
      <span class="menu__icone" aria-hidden="true"></span>
      Menu
    </button>
    <ul id="menu-lista" class="menu__lista">
      ${renderizarLista(navegacao, itemMenu(rotaAtual, base))}
    </ul>
  </nav>`;

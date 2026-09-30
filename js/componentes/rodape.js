/* ==================================================================
   Componente: rodapé
   ================================================================== */

import { escapar, renderizarLista } from '../utils/html.js';
import { caminhoPara } from '../roteador.js';
import { navegacao } from '../dados/navegacao.js';
import { contato } from '../dados/instituto.js';

export const rodape = ({ base = '' } = {}) => `
  <p class="rodape__nome">Instituto Raiz Viva</p>
  <p>CNPJ 12.345.678/0001-90 — organização da sociedade civil sem fins lucrativos.</p>

  <nav aria-label="Links do rodapé">
    <ul>
      ${renderizarLista(navegacao, (item) =>
        `<li><a href="${caminhoPara(item.rota, null, base)}">${escapar(item.rotulo)}</a></li>`)}
      <li><a href="mailto:${contato.email}">Contato</a></li>
    </ul>
  </nav>

  <p><small>&copy; 2026 Instituto Raiz Viva. Todos os direitos reservados.</small></p>`;

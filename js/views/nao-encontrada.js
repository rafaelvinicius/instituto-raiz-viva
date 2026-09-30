/* ==================================================================
   Página: rota inexistente
   ================================================================== */

import { caminhoPara } from '../roteador.js';

export const naoEncontrada = {
  titulo: 'Página não encontrada — Instituto Raiz Viva',
  descricao: 'O endereço acessado não existe no site do Instituto Raiz Viva.',
  cabecalho: {
    titulo: 'Página não encontrada',
    lema: 'O endereço pode ter mudado ou estar digitado errado'
  },

  renderizar: () => `
    <section class="intro">
      <h2>Não encontramos esta página</h2>
      <p>Confira o endereço ou use um dos caminhos abaixo.</p>
      <p>
        <a class="botao" href="${caminhoPara('/')}">Voltar ao início</a>
        <a class="botao botao--secundario" href="${caminhoPara('/projetos')}">Ver projetos</a>
      </p>
    </section>`
};

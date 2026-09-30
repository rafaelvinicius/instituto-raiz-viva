/* ==================================================================
   Página: Projetos sociais
   Os cartões são gerados a partir de dados/projetos.js.
   ================================================================== */

import { renderizarLista } from '../utils/html.js';
import { cartaoProjeto } from '../componentes/cartao-projeto.js';
import { listaDefinicoes } from '../componentes/lista-definicoes.js';
import { listaValores } from '../componentes/lista-valores.js';
import { chamadaApoio } from '../componentes/chamada-apoio.js';
import { projetos as listaDeProjetos } from '../dados/projetos.js';
import { faixasDeDoacao, frentesDeVoluntariado, primeirosPassos } from '../dados/instituto.js';

export const projetos = {
  titulo: 'Projetos sociais — Instituto Raiz Viva',
  descricao:
    'Conheça os projetos sociais do Instituto Raiz Viva: plantio comunitário, viveiro ' +
    'escola, calçada verde e formação de cuidadores.',
  cabecalho: {
    titulo: 'Projetos sociais',
    lema: 'Quatro frentes de trabalho em bairros com pouca cobertura arbórea'
  },

  renderizar: () => `
    <section class="intro">
      <h2>O que financiamos</h2>
      <p>
        Cada projeto abaixo tem orçamento, meta e prestação de contas próprios. Os
        relatórios trimestrais ficam disponíveis no portal da transparência do instituto.
      </p>
    </section>

    <section class="projetos">
      <h2>Projetos em andamento</h2>
      ${renderizarLista(listaDeProjetos, cartaoProjeto)}
    </section>

    <section class="doacao" id="como-doar">
      <h2>Como doar</h2>
      <p>
        A doação é mensal e pode ser destinada a um projeto específico ou distribuída
        entre todos. O valor é definido por você no formulário de cadastro.
      </p>

      <h3>O que cada valor cobre</h3>
      ${listaDefinicoes(faixasDeDoacao)}

      <h3>Prestação de contas</h3>
      <div class="alerta alerta--info">
        <div class="alerta__conteudo">
          <p>
            O recibo é emitido em até cinco dias úteis e o relatório financeiro é publicado
            a cada trimestre, com a lista de ruas atendidas no período.
          </p>
        </div>
      </div>
    </section>

    <section class="voluntariado" id="voluntariado">
      <h2>Como ser voluntário</h2>
      <p>
        Não é preciso experiência prévia. Toda função tem treinamento no próprio dia e
        acompanhamento de um cuidador já formado.
      </p>

      <h3>Frentes abertas</h3>
      ${listaValores(frentesDeVoluntariado)}

      <h3>Primeiros passos</h3>
      ${listaValores(primeirosPassos, { ordenada: true })}
    </section>

    ${chamadaApoio({
      titulo: 'Pronto para começar',
      texto:
        'Doação e voluntariado usam o mesmo formulário. Você marca se quer contribuir ' +
        'financeiramente, participar dos mutirões ou as duas coisas.',
      rotuloBotao: 'Ir para o cadastro'
    })}`
};

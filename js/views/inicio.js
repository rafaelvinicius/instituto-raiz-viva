/* ==================================================================
   Página: Início
   ================================================================== */

import { renderizarLista } from '../utils/html.js';
import { figura } from '../componentes/figura.js';
import { listaDefinicoes } from '../componentes/lista-definicoes.js';
import { listaValores } from '../componentes/lista-valores.js';
import { cartao } from '../componentes/cartao.js';
import { chamadaApoio } from '../componentes/chamada-apoio.js';
import { numeros, valores, frentesDeAtuacao, contato } from '../dados/instituto.js';

export const inicio = {
  titulo: 'Instituto Raiz Viva — reflorestamento urbano em São Paulo',
  descricao:
    'Instituto Raiz Viva: reflorestamento urbano e educação ambiental na zona leste de ' +
    'São Paulo. Conheça os projetos, doe ou seja voluntário.',
  cabecalho: {
    titulo: 'Instituto Raiz Viva',
    lema: 'Reflorestamento urbano e educação ambiental na zona leste de São Paulo'
  },

  renderizar: () => `
    <section class="destaque">
      <h2>Quem somos</h2>
      ${figura({
        nome: 'mutirao-plantio',
        alt: 'Voluntários plantando mudas de ipê no canteiro central de uma avenida',
        legenda: 'Mutirão de plantio na Avenida Sapopemba, março de 2026.',
        largura: 960,
        altura: 420,
        // larguras medidas: até 1023px ocupa a tela menos 2rem; acima, até 680px
        tamanhos: '(min-width: 1024px) 680px, calc(100vw - 2rem)',
        classe: 'destaque__figura'
      })}
      <p class="destaque__texto">
        O Instituto Raiz Viva é uma organização da sociedade civil sem fins lucrativos
        fundada em 2014. Plantamos árvores em ruas, praças e escolas públicas e formamos
        moradores para cuidar delas depois do plantio.
      </p>
      ${listaDefinicoes(numeros, 'numeros')}
    </section>

    <section class="missao">
      <h2>Missão e valores</h2>
      <p>
        Devolver cobertura vegetal aos bairros que menos a têm, tratando a árvore como
        infraestrutura pública: ela reduz a temperatura da rua, retém água de chuva e
        melhora a saúde de quem vive por perto.
      </p>
      ${listaValores(valores)}
    </section>

    <section class="atuacao">
      <h2>Como atuamos</h2>
      ${renderizarLista(frentesDeAtuacao, cartao)}
    </section>

    ${chamadaApoio({
      titulo: 'Apoie o instituto',
      texto:
        'Cada R$ 45 cobrem uma muda, o berço de plantio e dois anos de acompanhamento ' +
        'técnico. Doadores e voluntários se registram na página de cadastro.',
      rotuloBotao: 'Quero participar',
      lateral: true
    })}

    <section class="contato">
      <h2>Fale com a gente</h2>
      <address>
        <p>
          Av. Regente Feijó, 1295 — Jardim Anália Franco<br>
          São Paulo — SP, CEP 03342-000
        </p>
        <p>
          Telefone: <a href="tel:${contato.telefone.link}">${contato.telefone.exibicao}</a><br>
          E-mail: <a href="mailto:${contato.email}">${contato.email}</a>
        </p>
      </address>
      <p>
        Atendimento de segunda a sexta, das
        <time datetime="09:00">9h</time> às <time datetime="17:00">17h</time>.
      </p>
    </section>`
};

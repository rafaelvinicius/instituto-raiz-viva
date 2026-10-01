/* ==================================================================
   Instituto Raiz Viva — ponto de entrada da SPA
   Monta o layout fixo (cabeçalho e rodapé), liga as interações
   globais e entrega a navegação para o roteador.
   ================================================================== */

import { iniciarRoteador } from './roteador.js';
import { rotas, paginaNaoEncontrada } from './rotas.js';
import { cabecalho } from './componentes/cabecalho.js';
import { rodape } from './componentes/rodape.js';
import { iniciarMenu } from './interacoes/menu.js';
import { iniciarFeedback } from './interacoes/feedback.js';
import { iniciarAtalhoConteudo } from './interacoes/atalhos.js';
import { iniciarTema, temaEhEscuro } from './interacoes/tema.js';
import { carregarDatas } from './utils/datas.js';

// O CSS só esconde a lista do menu no celular quando esta classe existe.
document.documentElement.classList.add('js');

const elementoCabecalho = document.getElementById('cabecalho');
const elementoConteudo = document.getElementById('conteudo');
const metaDescricao = document.querySelector('meta[name="description"]');

document.getElementById('rodape').innerHTML = rodape();

iniciarMenu();
iniciarFeedback();
iniciarAtalhoConteudo();
iniciarTema();

// Biblioteca externa (Day.js): começa a carregar sem travar a renderização
carregarDatas();

iniciarRoteador({
  rotas,
  paginaNaoEncontrada,
  raiz: elementoConteudo,
  aoTrocarPagina: (pagina, rota) => {
    document.title = pagina.titulo;
    if (metaDescricao) {
      metaDescricao.setAttribute('content', pagina.descricao);
    }
    elementoCabecalho.innerHTML = cabecalho({
      ...pagina.cabecalho,
      rotaAtual: rota,
      temaEscuro: temaEhEscuro()
    });
  }
});

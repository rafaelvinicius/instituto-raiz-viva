/* ==================================================================
   Roteador da SPA
   ------------------------------------------------------------------
   As rotas ficam no hash da URL: #/projetos, #/cadastro...
   O hash foi escolhido porque o site é publicado no GitHub Pages, que
   não redireciona caminhos desconhecidos para o index.html. Com o hash,
   atualizar a página (F5) ou abrir um link direto sempre funciona.

   Formato: #/<pagina>/<ancora>
     #/                         página inicial
     #/projetos                 página de projetos
     #/projetos/viveiro-escola  página de projetos, rolando até o projeto
   ================================================================== */

/** Monta o endereço de uma rota. `base` permite linkar de outra página HTML. */
export const caminhoPara = (rota, ancora = null, base = '') =>
  `${base}#${rota}${ancora ? `/${ancora}` : ''}`;

/** Lê o hash atual e separa a rota da âncora. */
const lerEndereco = () => {
  const hash = window.location.hash;

  if (!hash.startsWith('#/')) {
    return { rota: '/', ancora: null };
  }

  const [, pagina = '', ancora = ''] = hash.slice(1).split('/');
  return {
    rota: `/${pagina}`,
    ancora: ancora ? decodeURIComponent(ancora) : null
  };
};

/** Rola até a âncora pedida ou volta ao topo, levando o foco junto. */
const posicionar = (ancora, moverFoco) => {
  const alvo = ancora ? document.getElementById(ancora) : null;

  if (alvo) {
    // tabindex="-1" permite focar uma seção sem colocá-la na ordem do Tab
    alvo.setAttribute('tabindex', '-1');
    alvo.focus({ preventScroll: true });
    alvo.scrollIntoView();
    return;
  }

  window.scrollTo(0, 0);

  // Na troca de página, o foco vai para o título. Sem isso, quem usa
  // teclado ou leitor de tela continuaria "preso" no link clicado,
  // sem perceber que o conteúdo mudou.
  if (moverFoco) {
    const titulo = document.querySelector('.cabecalho h1');
    if (titulo) {
      titulo.focus({ preventScroll: true });
    }
  }
};

/**
 * Inicia a navegação.
 * @param {Object}   opcoes.rotas               Mapa { '/rota': pagina }
 * @param {Object}   opcoes.paginaNaoEncontrada Página usada quando a rota não existe
 * @param {Element}  opcoes.raiz                Elemento onde as páginas são renderizadas
 * @param {Function} opcoes.aoTrocarPagina      Chamada antes de cada renderização
 *
 * Cada página é um objeto com:
 *   titulo, descricao, cabecalho { titulo, lema },
 *   renderizar() → string de HTML,
 *   aoMontar(raiz) → opcional, liga os eventos depois que o HTML existe.
 */
export const iniciarRoteador = ({ rotas, paginaNaoEncontrada, raiz, aoTrocarPagina }) => {
  let rotaAtual = null;

  const navegar = () => {
    // Hash sem barra (#algum-id) é uma âncora comum: o navegador cuida.
    if (rotaAtual && window.location.hash && !window.location.hash.startsWith('#/')) {
      return;
    }

    const { rota, ancora } = lerEndereco();
    const primeiraVez = rotaAtual === null;

    // Só renderiza de novo quando a página muda. Trocar apenas a âncora
    // (ex.: submenu de projetos) mantém a página e só rola até o ponto.
    if (rota !== rotaAtual) {
      const pagina = rotas[rota] ?? paginaNaoEncontrada;

      aoTrocarPagina(pagina, rota);
      raiz.innerHTML = pagina.renderizar();
      if (typeof pagina.aoMontar === 'function') {
        pagina.aoMontar(raiz);
      }
      rotaAtual = rota;
    }

    posicionar(ancora, !primeiraVez);
  };

  window.addEventListener('hashchange', navegar);
  navegar();
};

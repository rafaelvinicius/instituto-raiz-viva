/* ==================================================================
   Instituto Raiz Viva — menu principal (hambúrguer no celular)
   ------------------------------------------------------------------
   Na SPA o cabeçalho é renderizado de novo a cada troca de página,
   então os eventos usam delegação: ficam no document e procuram o
   botão no momento do clique. Assim, não é preciso ligá-los de novo
   depois de cada renderização.
   ================================================================== */

const obterBotao = () => document.querySelector('.menu__botao');

const estaAberto = () => obterBotao()?.getAttribute('aria-expanded') === 'true';

const alternar = (abrir) => obterBotao()?.setAttribute('aria-expanded', String(abrir));

export const iniciarMenu = () => {
  document.addEventListener('click', (evento) => {
    if (evento.target.closest('.menu__botao')) {
      alternar(!estaAberto());
      return;
    }

    // Clique fora do menu ou em um link fecha o painel
    if (estaAberto() &&
        (!evento.target.closest('.menu') || evento.target.closest('.menu__lista a'))) {
      alternar(false);
    }
  });

  // Esc fecha o menu e devolve o foco ao botão
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && estaAberto()) {
      alternar(false);
      obterBotao().focus();
    }
  });
};

/* ==================================================================
   Instituto Raiz Viva — menu principal (hambúrguer no celular)
   ================================================================== */

/* Marca a página como "com JavaScript" antes da renderização. O CSS só
   esconde a lista do menu quando essa classe existe; sem JavaScript o
   menu continua visível e funcional. */
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function () {
  var botao = document.querySelector('.menu__botao');
  var lista = document.getElementById('menu-lista');

  if (!botao || !lista) {
    return;
  }

  var estaAberto = function () {
    return botao.getAttribute('aria-expanded') === 'true';
  };

  var alternar = function (abrir) {
    botao.setAttribute('aria-expanded', String(abrir));
  };

  botao.addEventListener('click', function () {
    alternar(!estaAberto());
  });

  // Esc fecha o menu e devolve o foco ao botão
  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && estaAberto()) {
      alternar(false);
      botao.focus();
    }
  });

  // Clique fora do menu ou em um link fecha o painel
  document.addEventListener('click', function (evento) {
    if (!estaAberto()) {
      return;
    }
    if (!evento.target.closest('.menu') || evento.target.closest('.menu__lista a')) {
      alternar(false);
    }
  });
});

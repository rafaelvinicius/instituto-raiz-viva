/* ==================================================================
   Tema claro / escuro
   ------------------------------------------------------------------
   - Sem escolha salva, o CSS segue o sistema (prefers-color-scheme).
   - O botão "Modo escuro" grava a escolha no localStorage e aplica
     data-tema="escuro" ou "claro" no <html>, que vence o sistema.
   - Um script curto no <head> das páginas aplica a escolha salva antes
     da primeira pintura, para a página não piscar no tema errado.
   - O estado do botão fica em aria-pressed, anunciado pelo leitor de
     tela como "Modo escuro, ativado/desativado".
   ================================================================== */

import { salvar } from '../servicos/armazenamento.js';

const CHAVE = 'tema';
const sistemaEscuro = window.matchMedia('(prefers-color-scheme: dark)');

export const temaEhEscuro = () => {
  const escolhido = document.documentElement.dataset.tema;
  return escolhido ? escolhido === 'escuro' : sistemaEscuro.matches;
};

const atualizarBotoes = () => {
  document.querySelectorAll('[data-alternar-tema]').forEach((botao) => {
    botao.setAttribute('aria-pressed', String(temaEhEscuro()));
  });
};

export const iniciarTema = () => {
  document.addEventListener('click', (evento) => {
    if (!evento.target.closest('[data-alternar-tema]')) return;

    const novo = temaEhEscuro() ? 'claro' : 'escuro';
    document.documentElement.dataset.tema = novo;
    salvar(CHAVE, novo);
    atualizarBotoes();
  });

  // Se a pessoa não escolheu nada e muda o tema do sistema com a
  // página aberta, o CSS acompanha sozinho; aqui só o botão é atualizado.
  sistemaEscuro.addEventListener('change', atualizarBotoes);
};

/* ==================================================================
   Componentes de feedback: toast e modal
   ------------------------------------------------------------------
   Uso em JavaScript:
     import { toast, abrirModal } from './interacoes/feedback.js';
     toast('Mensagem', 'sucesso' | 'aviso' | 'erro' | 'info');
     abrirModal('id-do-dialog');
   Ou direto no HTML, sem escrever JavaScript:
     <button data-toast="Mensagem" data-toast-tipo="sucesso">
     <button data-abrir-modal="id-do-dialog">
     <button data-fechar-modal>          (dentro do dialog)
   ================================================================== */

const TEMPO_TOAST = 5000;       // ms até o toast sumir sozinho
const TEMPO_SAIDA = 250;        // ms da animação de saída (igual ao CSS)

let regiao = null;

// Região única onde os toasts aparecem. role="status" faz o leitor de
// tela anunciar a mensagem sem tirar o foco do que a pessoa fazia.
const obterRegiao = () => {
  if (!regiao || !regiao.isConnected) {
    regiao = document.createElement('div');
    regiao.className = 'toasts';
    regiao.setAttribute('role', 'status');
    regiao.setAttribute('aria-live', 'polite');
    document.body.append(regiao);
  }
  return regiao;
};

export const toast = (mensagem, tipo = 'info') => {
  const item = document.createElement('div');
  item.className = `alerta alerta--${tipo} toast`;

  const texto = document.createElement('p');
  texto.className = 'alerta__conteudo';
  texto.textContent = mensagem;

  const fechar = document.createElement('button');
  fechar.type = 'button';
  fechar.className = 'botao-fechar';
  fechar.setAttribute('aria-label', 'Fechar notificação');
  fechar.textContent = '×';

  item.append(texto, fechar);
  obterRegiao().append(item);

  const remover = () => {
    if (!item.isConnected) return;
    item.classList.add('toast--saindo');
    setTimeout(() => item.remove(), TEMPO_SAIDA);
  };

  fechar.addEventListener('click', remover);

  // O aviso some sozinho, mas o tempo para enquanto o ponteiro ou o
  // foco do teclado estão sobre ele, para dar tempo de ler (WCAG 2.2.1).
  let temporizador = setTimeout(remover, TEMPO_TOAST);
  const pausar = () => clearTimeout(temporizador);
  const retomar = () => {
    clearTimeout(temporizador);
    temporizador = setTimeout(remover, TEMPO_TOAST);
  };
  item.addEventListener('mouseenter', pausar);
  item.addEventListener('mouseleave', retomar);
  item.addEventListener('focusin', pausar);
  item.addEventListener('focusout', retomar);
};

// O <dialog> nativo prende o foco dentro do modal, fecha com Esc e
// devolve o foco ao elemento que o abriu.
export const abrirModal = (id) => {
  const modal = document.getElementById(id);
  if (typeof modal?.showModal === 'function') {
    modal.showModal();
  }
};

// Ligado uma única vez, no document: funciona também para botões e
// modais que aparecem depois, quando a SPA troca de página.
export const iniciarFeedback = () => {
  document.addEventListener('click', (evento) => {
    const alvo = evento.target;

    const abrir = alvo.closest('[data-abrir-modal]');
    if (abrir) {
      abrirModal(abrir.dataset.abrirModal);
      return;
    }

    const fechar = alvo.closest('[data-fechar-modal]');
    if (fechar?.closest('dialog')) {
      fechar.closest('dialog').close();
      return;
    }

    // Clique no fundo escurecido (fora do conteúdo) fecha o modal
    if (alvo.tagName === 'DIALOG') {
      alvo.close();
      return;
    }

    const gatilhoToast = alvo.closest('[data-toast]');
    if (gatilhoToast) {
      toast(gatilhoToast.dataset.toast, gatilhoToast.dataset.toastTipo);
    }
  });
};

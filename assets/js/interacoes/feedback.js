/* ==================================================================
   Instituto Raiz Viva — componentes de feedback (toast e modal)
   Uso:
     RaizViva.toast('Mensagem', 'sucesso' | 'aviso' | 'erro' | 'info');
     RaizViva.abrirModal('id-do-dialog');
   Ou, sem escrever JavaScript, direto no HTML:
     <button data-toast="Mensagem" data-toast-tipo="sucesso">
     <button data-abrir-modal="id-do-dialog">
     <button data-fechar-modal>          (dentro do dialog)
   ================================================================== */

(function () {
  'use strict';

  var TEMPO_TOAST = 5000;
  var regiao = null;

  // Região única onde os toasts aparecem; role="status" faz o leitor de
  // tela anunciar a mensagem sem tirar o foco do que a pessoa fazia.
  var obterRegiao = function () {
    if (!regiao) {
      regiao = document.createElement('div');
      regiao.className = 'toasts';
      regiao.setAttribute('role', 'status');
      regiao.setAttribute('aria-live', 'polite');
      document.body.appendChild(regiao);
    }
    return regiao;
  };

  var toast = function (mensagem, tipo) {
    var item = document.createElement('div');
    item.className = 'alerta alerta--' + (tipo || 'info') + ' toast';

    var texto = document.createElement('p');
    texto.className = 'alerta__conteudo';
    texto.textContent = mensagem;

    var fechar = document.createElement('button');
    fechar.type = 'button';
    fechar.className = 'botao-fechar';
    fechar.setAttribute('aria-label', 'Fechar notificação');
    fechar.innerHTML = '&times;';

    item.appendChild(texto);
    item.appendChild(fechar);
    obterRegiao().appendChild(item);

    var remover = function () {
      if (!item.parentNode) { return; }
      item.classList.add('toast--saindo');
      setTimeout(function () {
        if (item.parentNode) { item.parentNode.removeChild(item); }
      }, 250);
    };

    fechar.addEventListener('click', remover);
    setTimeout(remover, TEMPO_TOAST);
  };

  // O <dialog> nativo já prende o foco dentro do modal, fecha com Esc e
  // devolve o foco ao elemento que o abriu.
  var abrirModal = function (id) {
    var modal = document.getElementById(id);
    if (modal && typeof modal.showModal === 'function') {
      modal.showModal();
    }
  };

  document.addEventListener('click', function (evento) {
    var alvo = evento.target;

    var abrir = alvo.closest('[data-abrir-modal]');
    if (abrir) {
      abrirModal(abrir.getAttribute('data-abrir-modal'));
      return;
    }

    var fechar = alvo.closest('[data-fechar-modal]');
    if (fechar && fechar.closest('dialog')) {
      fechar.closest('dialog').close();
      return;
    }

    // Clique no fundo escurecido (fora do conteúdo) fecha o modal
    if (alvo.tagName === 'DIALOG') {
      alvo.close();
      return;
    }

    var gatilhoToast = alvo.closest('[data-toast]');
    if (gatilhoToast) {
      toast(gatilhoToast.getAttribute('data-toast'), gatilhoToast.getAttribute('data-toast-tipo'));
    }
  });

  window.RaizViva = { toast: toast, abrirModal: abrirModal };
}());

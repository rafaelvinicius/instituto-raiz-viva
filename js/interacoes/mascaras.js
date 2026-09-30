/* ==================================================================
   Máscaras de entrada (CPF, telefone e CEP)
   Aplicadas a qualquer campo com o atributo data-mascara.
   ================================================================== */

export const somenteNumeros = (valor) => valor.replace(/\D/g, '');

export const formatadores = {
  cpf: (valor) => {
    const n = somenteNumeros(valor).slice(0, 11);
    if (n.length > 9) return n.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    if (n.length > 6) return n.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    if (n.length > 3) return n.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    return n;
  },

  telefone: (valor) => {
    const n = somenteNumeros(valor).slice(0, 11);
    if (n.length > 10) return n.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
    if (n.length > 6) return n.replace(/(\d{2})(\d{4})(\d{1,4})/, '($1) $2-$3');
    if (n.length > 2) return n.replace(/(\d{2})(\d{1,5})/, '($1) $2');
    if (n.length > 0) return `(${n}`;
    return n;
  },

  cep: (valor) => {
    const n = somenteNumeros(valor).slice(0, 8);
    return n.length > 5 ? n.replace(/(\d{5})(\d{1,3})/, '$1-$2') : n;
  }
};

export const aplicarMascaras = (raiz) => {
  raiz.querySelectorAll('[data-mascara]').forEach((campo) => {
    const formatar = formatadores[campo.dataset.mascara];
    if (!formatar) return;

    campo.addEventListener('input', () => {
      const posicao = campo.selectionStart;
      const tamanhoAnterior = campo.value.length;

      campo.value = formatar(campo.value);

      // Mantém o cursor no lugar quando a pessoa edita no meio do texto
      if (posicao < tamanhoAnterior) {
        const diferenca = campo.value.length - tamanhoAnterior;
        campo.setSelectionRange(posicao + diferenca, posicao + diferenca);
      }
    });
  });
};

/* ==================================================================
   Utilitários para montar HTML a partir de dados
   ================================================================== */

const ENTIDADES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

/**
 * Converte caracteres especiais em entidades antes de inserir um valor
 * em um template. Assim, um texto vindo de dados (ou, na etapa seguinte,
 * digitado pelo usuário) nunca é interpretado como HTML.
 */
export const escapar = (valor) =>
  String(valor ?? '').replace(/[&<>"']/g, (caractere) => ENTIDADES[caractere]);

/** Aplica um componente a cada item de uma lista e junta o resultado. */
export const renderizarLista = (itens, componente) => itens.map(componente).join('');

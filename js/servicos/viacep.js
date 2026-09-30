/* ==================================================================
   Serviço de rede: consulta de endereço pelo CEP (API ViaCEP)
   ------------------------------------------------------------------
   Só faz a requisição e devolve os dados já no formato do projeto.
   Não conhece o formulário nem o DOM: quem chama decide o que fazer
   com o resultado.
   ================================================================== */

const URL_BASE = 'https://viacep.com.br/ws';

/**
 * @param {string} cep  Com ou sem máscara
 * @returns {Promise<{logradouro: string, cidade: string, uf: string} | null>}
 *          null quando o CEP não existe. Lança erro se a consulta falhar.
 */
export const consultarCep = async (cep) => {
  const numeros = String(cep).replace(/\D/g, '');
  if (numeros.length !== 8) {
    throw new Error('O CEP precisa ter 8 números.');
  }

  const resposta = await fetch(`${URL_BASE}/${numeros}/json/`);
  if (!resposta.ok) {
    throw new Error(`ViaCEP respondeu com status ${resposta.status}.`);
  }

  const dados = await resposta.json();
  if (dados.erro) return null;

  return {
    logradouro: dados.logradouro ?? '',
    cidade: dados.localidade ?? '',
    uf: dados.uf ?? ''
  };
};

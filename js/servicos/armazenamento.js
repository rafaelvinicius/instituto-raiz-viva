/* ==================================================================
   Persistência no navegador (localStorage)
   ------------------------------------------------------------------
   O localStorage só guarda texto. Por isso:
   - salvar() converte o valor com JSON.stringify antes do setItem;
   - ler() faz o getItem e converte de volta com JSON.parse.

   Todas as chaves recebem o prefixo "raizviva:" para não colidir com
   dados de outros sites publicados no mesmo domínio (github.io).
   Os acessos ficam em try/catch porque o armazenamento pode estar
   bloqueado (navegação privada) ou cheio, e um texto salvo pode estar
   corrompido. Nesses casos a aplicação segue funcionando sem ele.
   ================================================================== */

const PREFIXO = 'raizviva:';

export const salvar = (chave, valor) => {
  try {
    localStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
};

/**
 * @param {*} padrao     Valor devolvido quando não há nada salvo ou o dado é inválido
 * @param {Function} ehValido  Confere se o formato lido é o esperado
 */
export const ler = (chave, padrao, ehValido = () => true) => {
  try {
    const texto = localStorage.getItem(PREFIXO + chave);
    if (texto === null) return padrao;

    const valor = JSON.parse(texto);
    return ehValido(valor) ? valor : padrao;
  } catch {
    return padrao;
  }
};

export const remover = (chave) => {
  try {
    localStorage.removeItem(PREFIXO + chave);
  } catch {
    // Sem acesso ao armazenamento: não há o que remover
  }
};

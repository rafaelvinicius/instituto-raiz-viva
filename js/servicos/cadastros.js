/* ==================================================================
   Serviço de dados do cadastro (sobre o localStorage)
   ------------------------------------------------------------------
   Trabalha só com objetos comuns: não lê nem preenche o formulário.
   Duas chaves:

   raizviva:rascunho-cadastro  (objeto)
     { salvoEm: "2026-09-29T21:10:00.000Z", campos: { nome: "...", ... } }
     O que a pessoa está digitando, para não se perder num F5 ou no
     fechamento da aba.

   raizviva:cadastros  (array de objetos)
     [{ nome, email, perfil, valor, enviadoEm }, ...]
     Cadastros concluídos neste navegador.

   Por privacidade (LGPD), o CPF e o aceite dos termos nunca são
   salvos: o CPF é um dado sensível e o aceite deve ser dado de novo
   a cada envio. O histórico guarda só o necessário para exibição.
   ================================================================== */

import { salvar, ler, remover } from './armazenamento.js';

const CHAVE_RASCUNHO = 'rascunho-cadastro';
const CHAVE_CADASTROS = 'cadastros';

export const CAMPOS_NAO_SALVOS = ['cpf', 'termos'];

const ehObjeto = (valor) => valor !== null && typeof valor === 'object' && !Array.isArray(valor);

/* ---------- Rascunho --------------------------------------------- */

/** Grava o rascunho. Se não houver nada preenchido, apaga o anterior. */
export const salvarRascunho = (campos) => {
  const permitidos = Object.fromEntries(
    Object.entries(campos).filter(([nome]) => !CAMPOS_NAO_SALVOS.includes(nome))
  );

  const temConteudo = Object.values(permitidos).some((valor) => valor !== '');
  if (!temConteudo) {
    remover(CHAVE_RASCUNHO);
    return;
  }

  salvar(CHAVE_RASCUNHO, { salvoEm: new Date().toISOString(), campos: permitidos });
};

/** Lê o rascunho salvo. Devolve null se não houver um válido. */
export const lerRascunho = () => {
  const rascunho = ler(CHAVE_RASCUNHO, null, (valor) => ehObjeto(valor) && ehObjeto(valor.campos));
  if (!rascunho) return null;

  // Mesmo que alguém edite o armazenamento à mão, campos sensíveis não voltam
  CAMPOS_NAO_SALVOS.forEach((nome) => delete rascunho.campos[nome]);
  return rascunho;
};

export const descartarRascunho = () => remover(CHAVE_RASCUNHO);

/* ---------- Histórico de cadastros ------------------------------- */

export const lerCadastros = () => ler(CHAVE_CADASTROS, [], Array.isArray);

/**
 * Acrescenta um cadastro ao início do histórico. Um novo envio com o
 * mesmo e-mail substitui o anterior, para não duplicar a mesma pessoa.
 */
export const registrarCadastro = (dados) => {
  const novo = {
    nome: dados.nome,
    email: dados.email,
    perfil: dados.perfil,
    valor: dados.valor ? Number(dados.valor) : null,
    enviadoEm: new Date().toISOString()
  };

  const email = novo.email.toLowerCase();
  const outros = lerCadastros().filter((item) => item.email?.toLowerCase() !== email);
  const lista = [novo, ...outros];

  salvar(CHAVE_CADASTROS, lista);
  return lista;
};

export const apagarCadastros = () => remover(CHAVE_CADASTROS);

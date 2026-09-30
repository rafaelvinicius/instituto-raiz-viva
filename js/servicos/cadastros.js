/* ==================================================================
   Dados do cadastro guardados no navegador
   ------------------------------------------------------------------
   Duas chaves no localStorage:

   raizviva:rascunho-cadastro  (objeto)
     { salvoEm: "2026-09-29T21:10:00.000Z", campos: { nome: "...", ... } }
     O que a pessoa está digitando. É gravado a cada alteração e
     restaurado quando a página de cadastro abre, para que um F5 ou
     o fechamento da aba não apaguem o preenchimento.

   raizviva:cadastros  (array de objetos)
     [{ nome, email, perfil, valor, enviadoEm }, ...]
     Cadastros concluídos neste navegador, exibidos na página.

   Por privacidade (LGPD), o CPF e o aceite dos termos nunca são
   salvos: o CPF é um dado sensível e o aceite deve ser dado de novo
   a cada envio. O histórico guarda só o necessário para exibição.
   ================================================================== */

import { salvar, ler, remover } from '../utils/armazenamento.js';

const CHAVE_RASCUNHO = 'rascunho-cadastro';
const CHAVE_CADASTROS = 'cadastros';
const CAMPOS_NAO_SALVOS = ['cpf', 'termos'];

const ehObjeto = (valor) => valor !== null && typeof valor === 'object' && !Array.isArray(valor);

/* ---------- Rascunho --------------------------------------------- */

export const salvarRascunho = (formulario) => {
  const campos = {};
  new FormData(formulario).forEach((valor, nome) => {
    if (!CAMPOS_NAO_SALVOS.includes(nome)) campos[nome] = valor;
  });

  const temConteudo = Object.values(campos).some((valor) => valor !== '');
  if (!temConteudo) {
    remover(CHAVE_RASCUNHO);
    return;
  }

  salvar(CHAVE_RASCUNHO, { salvoEm: new Date().toISOString(), campos });
};

/** Lê o rascunho salvo. Devolve null se não houver um válido. */
export const lerRascunho = () =>
  ler(CHAVE_RASCUNHO, null, (valor) => ehObjeto(valor) && ehObjeto(valor.campos));

/** Devolve os valores do rascunho aos campos. Retorna os nomes restaurados. */
export const restaurarRascunho = (formulario, rascunho) => {
  const restaurados = [];

  Object.entries(rascunho.campos).forEach(([nome, valor]) => {
    if (CAMPOS_NAO_SALVOS.includes(nome) || typeof valor !== 'string' || valor === '') return;

    const elemento = formulario.elements[nome];
    if (!elemento) return;

    if (elemento instanceof RadioNodeList) {
      elemento.value = valor;                   // marca o rádio com esse valor
    } else if (elemento.type === 'checkbox') {
      elemento.checked = true;
    } else {
      elemento.value = valor;
    }
    restaurados.push(nome);
  });

  return restaurados;
};

export const descartarRascunho = () => remover(CHAVE_RASCUNHO);

/* ---------- Histórico de cadastros ------------------------------- */

export const lerCadastros = () => ler(CHAVE_CADASTROS, [], Array.isArray);

/**
 * Acrescenta um cadastro ao histórico. Um novo envio com o mesmo e-mail
 * substitui o anterior, para não duplicar a mesma pessoa.
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

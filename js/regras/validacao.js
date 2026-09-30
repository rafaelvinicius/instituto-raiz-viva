/* ==================================================================
   Regras de consistência do cadastro
   ------------------------------------------------------------------
   Lógica pura: não acessa o DOM, a rede nem o armazenamento.
   Cada regra recebe o valor de um campo e os demais dados do
   formulário (um objeto comum) e devolve '' (válido) ou a mensagem
   de erro. Por não depender do navegador, o arquivo pode ser testado
   direto no Node (testes/regras.test.mjs).
   ================================================================== */

import { calcularIdade } from '../utils/datas.js';

const LETRAS = "A-Za-zÀ-ÖØ-öø-ÿ'";

const REGEX = {
  nome: new RegExp(`^[${LETRAS}]+(?:\\s+[${LETRAS}]+)+$`), // nome e sobrenome
  cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,                     // 000.000.000-00
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,                 // algo@dominio.ext
  telefone: /^\(\d{2}\) \d{4,5}-\d{4}$/,                  // (11) 90000-0000
  cep: /^\d{5}-\d{3}$/,                                   // 00000-000
  cidade: new RegExp(`^[${LETRAS} -]{2,}$`),              // só letras
  numero: /\d/                                            // endereço com número
};

const IDADE_MINIMA = 18;
export const LIMITE_MENSAGEM = 500;

/* ---------- Funções de apoio ------------------------------------- */

/** Confere os dois dígitos verificadores do CPF. */
export const cpfEhValido = (valor) => {
  const n = valor.replace(/\D/g, '');
  if (n.length !== 11 || /^(\d)\1{10}$/.test(n)) return false;

  const digito = (quantidade) => {
    let soma = 0;
    for (let i = 0; i < quantidade; i += 1) {
      soma += Number(n[i]) * (quantidade + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return digito(9) === Number(n[9]) && digito(10) === Number(n[10]);
};

/** Data limite para ter a idade mínima hoje, no formato do input date. */
export const dataMaximaNascimento = (hoje = new Date()) => {
  const ano = hoje.getFullYear() - IDADE_MINIMA;
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  // Data local (toISOString usaria o fuso UTC e poderia adiantar um dia)
  return `${ano}-${mes}-${dia}`;
};

/** O valor da doação só é obrigatório para quem vai doar. */
export const exigeDoacao = (perfil) => perfil === 'doador' || perfil === 'ambos';

/* ---------- Regras por campo ------------------------------------- */

export const regras = {
  nome: (valor) => {
    if (!valor) return 'Informe seu nome completo.';
    if (!REGEX.nome.test(valor)) return 'Informe nome e sobrenome, usando apenas letras.';
    if (valor.length < 6) return 'O nome precisa ter pelo menos 6 letras.';
    return '';
  },

  cpf: (valor) => {
    if (!valor) return 'Informe seu CPF.';
    if (!REGEX.cpf.test(valor)) return 'Digite os 11 números do CPF.';
    if (!cpfEhValido(valor)) return 'Este CPF não existe. Confira os números digitados.';
    return '';
  },

  nascimento: (valor) => {
    if (!valor) return 'Informe sua data de nascimento.';
    if (valor < '1920-01-01') return 'Confira o ano de nascimento.';
    if (calcularIdade(valor) < IDADE_MINIMA) return 'É preciso ter 18 anos ou mais para participar.';
    return '';
  },

  email: (valor) => {
    if (!valor) return 'Informe seu e-mail.';
    if (!REGEX.email.test(valor)) return 'Digite um e-mail válido, como maria@exemplo.com.br.';
    return '';
  },

  telefone: (valor) => {
    if (!valor) return 'Informe seu telefone celular.';
    if (!REGEX.telefone.test(valor)) return 'Informe o DDD e o número, com 10 ou 11 dígitos.';
    return '';
  },

  cep: (valor) => {
    if (!valor) return 'Informe seu CEP.';
    if (!REGEX.cep.test(valor)) return 'Digite os 8 números do CEP.';
    return '';
  },

  endereco: (valor) => {
    if (!valor) return 'Informe seu endereço.';
    if (!REGEX.numero.test(valor)) return 'Inclua o número do imóvel.';
    return '';
  },

  cidade: (valor) => {
    if (!valor) return 'Informe sua cidade.';
    if (!REGEX.cidade.test(valor)) return 'Use apenas letras no nome da cidade.';
    return '';
  },

  uf: (valor) => (valor ? '' : 'Selecione o estado.'),

  perfil: (valor) => (valor ? '' : 'Escolha como você quer contribuir.'),

  // Regra entre campos: o valor só é obrigatório para quem vai doar
  valor: (valor, dados) => {
    if (!valor) {
      return exigeDoacao(dados.perfil) ? 'Informe o valor da doação mensal.' : '';
    }
    const numero = Number(valor);
    if (!Number.isFinite(numero)) return 'Informe apenas números.';
    if (numero < 10) return 'O valor mínimo é R$ 10.';
    if (numero > 10000) return 'O valor máximo é R$ 10.000.';
    if (numero % 5 !== 0) return 'Use valores múltiplos de R$ 5, como 45 ou 50.';
    return '';
  },

  mensagem: (valor) =>
    valor.length > LIMITE_MENSAGEM ? `Use no máximo ${LIMITE_MENSAGEM} caracteres.` : '',

  termos: (valor) => (valor ? '' : 'É preciso aceitar a política de privacidade.')
};

/** Aplica uma regra. Devolve '' para campos sem regra. */
export const verificarValor = (nome, dados) => {
  const regra = regras[nome];
  return regra ? regra(dados[nome] ?? '', dados) : '';
};

/** Verifica todos os campos. Devolve { campo: mensagem } só com os que falharam. */
export const verificarDados = (dados) =>
  Object.fromEntries(
    Object.keys(regras)
      .map((nome) => [nome, verificarValor(nome, dados)])
      .filter(([, mensagem]) => mensagem !== '')
  );

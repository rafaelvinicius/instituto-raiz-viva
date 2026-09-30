/* ==================================================================
   Verificação de consistência do formulário de cadastro
   ------------------------------------------------------------------
   1. REGRAS: uma função por campo. Recebe o valor e os demais dados
      do formulário e devolve '' (válido) ou a mensagem de erro.
   2. EXIBIÇÃO: aplica as classes .campo--erro / .campo--valido no
      contêiner do campo, injeta a mensagem de erro no HTML e mantém
      os atributos de acessibilidade (aria-invalid, aria-describedby).
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
const TAMANHO_MENSAGEM = 500;

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

const exigeDoacao = (perfil) => perfil === 'doador' || perfil === 'ambos';

/* ---------- 1. Regras -------------------------------------------- */

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
    valor.length > TAMANHO_MENSAGEM ? `Use no máximo ${TAMANHO_MENSAGEM} caracteres.` : '',

  termos: (valor) => (valor ? '' : 'É preciso aceitar a política de privacidade.')
};

/* ---------- 2. Exibição ------------------------------------------ */

/** Lê o formulário como objeto { nome: valor }, sem espaços nas pontas. */
export const lerDados = (formulario) => {
  const dados = {};
  new FormData(formulario).forEach((valor, nome) => {
    dados[nome] = typeof valor === 'string' ? valor.trim() : valor;
  });
  return dados;
};

const elementosDoCampo = (formulario, nome) =>
  Array.from(formulario.querySelectorAll(`[name="${nome}"]`));

// O grupo de rádio usa o fieldset; os demais, a div .campo ou .opcao
const conteinerDoCampo = (elemento) =>
  elemento.closest('.grupo-opcoes') || elemento.closest('.campo') || elemento.closest('.opcao');

const idDoErro = (nome) => `erro-${nome}`;

const vincularDescricao = (elemento, id, ativo) => {
  const ids = (elemento.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
  const semErro = ids.filter((item) => item !== id);
  const novos = ativo ? [...semErro, id] : semErro;

  if (novos.length) {
    elemento.setAttribute('aria-describedby', novos.join(' '));
  } else {
    elemento.removeAttribute('aria-describedby');
  }
};

/**
 * Mostra o resultado da verificação de um campo.
 * @param {string} mensagem  '' quando o campo está correto
 * @param {boolean} preenchido  campos opcionais vazios ficam neutros
 */
export const exibirEstado = (formulario, nome, mensagem, preenchido) => {
  const elementos = elementosDoCampo(formulario, nome);
  if (!elementos.length) return;

  const conteiner = conteinerDoCampo(elementos[0]);
  const id = idDoErro(nome);

  formulario.querySelector(`#${id}`)?.remove();

  conteiner.classList.toggle('campo--erro', Boolean(mensagem));
  conteiner.classList.toggle('campo--valido', !mensagem && preenchido);

  elementos.forEach((elemento) => {
    // setCustomValidity mantém a API nativa (checkValidity) coerente com a regra
    elemento.setCustomValidity(mensagem);
    if (mensagem) {
      elemento.setAttribute('aria-invalid', 'true');
    } else {
      elemento.removeAttribute('aria-invalid');
    }
    vincularDescricao(elemento, id, Boolean(mensagem));
  });

  if (mensagem) {
    const aviso = document.createElement('p');
    aviso.id = id;
    aviso.className = 'campo__erro';
    aviso.textContent = mensagem;
    conteiner.append(aviso);
  }
};

/** Verifica um campo pelo nome, exibe o resultado e devolve a mensagem. */
export const validarCampo = (formulario, nome) => {
  const regra = regras[nome];
  if (!regra) return '';

  const dados = lerDados(formulario);
  const valor = dados[nome] ?? '';
  const mensagem = regra(valor, dados);

  exibirEstado(formulario, nome, mensagem, valor !== '');
  return mensagem;
};

/** Verifica todos os campos com regra. Devolve os nomes dos que têm erro. */
export const validarFormulario = (formulario) =>
  Object.keys(regras).filter((nome) => validarCampo(formulario, nome) !== '');

/** Remove todas as marcações de erro e de sucesso. */
export const limparEstados = (formulario) => {
  Object.keys(regras).forEach((nome) => exibirEstado(formulario, nome, '', false));
};

export const campoExigeValor = exigeDoacao;
export const LIMITE_MENSAGEM = TAMANHO_MENSAGEM;

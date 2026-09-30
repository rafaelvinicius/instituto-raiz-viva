/* ==================================================================
   Campos do formulário no DOM
   ------------------------------------------------------------------
   Faz a ponte entre o formulário na tela e os dados em objeto:
   - lerDados(): formulário → objeto { campo: valor };
   - preencherCampos(): objeto → formulário (usado no rascunho);
   - exibirEstado(): mostra o resultado de uma regra no campo,
     com as classes .campo--erro / .campo--valido, a mensagem
     injetada no HTML e os atributos aria-invalid e aria-describedby.
   As regras em si ficam em regras/validacao.js.
   ================================================================== */

import { regras, verificarValor } from '../regras/validacao.js';

/** Lê o formulário como objeto { nome: valor }, sem espaços nas pontas. */
export const lerDados = (formulario) => {
  const dados = {};
  new FormData(formulario).forEach((valor, nome) => {
    dados[nome] = typeof valor === 'string' ? valor.trim() : valor;
  });
  return dados;
};

/** Devolve valores aos campos. Retorna os nomes que foram preenchidos. */
export const preencherCampos = (formulario, campos) => {
  const preenchidos = [];

  Object.entries(campos).forEach(([nome, valor]) => {
    const elemento = formulario.elements[nome];
    if (!elemento || typeof valor !== 'string' || valor === '') return;

    if (elemento instanceof RadioNodeList) {
      elemento.value = valor;                   // marca o rádio com esse valor
    } else if (elemento.type === 'checkbox') {
      elemento.checked = true;
    } else {
      elemento.value = valor;
    }
    preenchidos.push(nome);
  });

  return preenchidos;
};

/* ---------- Estado visual --------------------------------------- */

const elementosDoCampo = (formulario, nome) =>
  Array.from(formulario.querySelectorAll(`[name="${nome}"]`));

// O grupo de rádio usa o fieldset; os demais, a div .campo ou .opcao
const conteinerDoCampo = (elemento) =>
  elemento.closest('.grupo-opcoes') || elemento.closest('.campo') || elemento.closest('.opcao');

const idDoErro = (nome) => `erro-${nome}`;

const vincularDescricao = (elemento, id, ativo) => {
  const ids = (elemento.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
  const novos = ids.filter((item) => item !== id);
  if (ativo) novos.push(id);

  if (novos.length) {
    elemento.setAttribute('aria-describedby', novos.join(' '));
  } else {
    elemento.removeAttribute('aria-describedby');
  }
};

/**
 * Mostra o resultado da verificação de um campo.
 * @param {string}  mensagem   '' quando o campo está correto
 * @param {boolean} preenchido campos opcionais vazios ficam neutros
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

// Quando o texto digitado não pode ser convertido (ex.: "1e" num campo
// numérico ou uma data incompleta), o navegador entrega value = '' ao
// JavaScript e marca validity.badInput. Sem esta checagem, a regra
// trataria o campo como vazio e aceitaria o valor.
const MENSAGEM_ENTRADA_INVALIDA = {
  number: 'Informe apenas números, sem letras ou símbolos.',
  date: 'Complete a data no formato dia/mês/ano.'
};

const entradaInvalida = (formulario, nome) =>
  elementosDoCampo(formulario, nome).find((elemento) => elemento.validity?.badInput);

/** Verifica um campo pelo nome, mostra o resultado e devolve a mensagem. */
export const validarCampo = (formulario, nome) => {
  if (!regras[nome]) return '';

  const invalido = entradaInvalida(formulario, nome);
  if (invalido) {
    const mensagem = MENSAGEM_ENTRADA_INVALIDA[invalido.type] ?? 'Valor inválido.';
    exibirEstado(formulario, nome, mensagem, true);
    return mensagem;
  }

  const dados = lerDados(formulario);
  const mensagem = verificarValor(nome, dados);
  exibirEstado(formulario, nome, mensagem, (dados[nome] ?? '') !== '');
  return mensagem;
};

/** Verifica todos os campos com regra. Devolve os nomes dos que têm erro. */
export const validarFormulario = (formulario) =>
  Object.keys(regras).filter((nome) => validarCampo(formulario, nome) !== '');

/** Remove todas as marcações de erro e de sucesso. */
export const limparEstados = (formulario) => {
  Object.keys(regras).forEach((nome) => exibirEstado(formulario, nome, '', false));
};

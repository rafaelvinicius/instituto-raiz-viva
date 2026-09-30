/* ==================================================================
   Formulário de cadastro: liga os eventos do formulário
   ------------------------------------------------------------------
   Chamado pela página de cadastro em aoMontar(), porque o formulário
   só existe no DOM depois que a página é renderizada.

   Quando cada campo é verificado:
   - ao sair do campo (focusout): primeira verificação;
   - ao digitar (input): em tempo real, mas só nos campos que a pessoa
     já visitou. Assim o erro não aparece antes de ela terminar de
     digitar, e some assim que o valor é corrigido;
   - ao enviar (submit): todos os campos de uma vez.
   ================================================================== */

import { toast, abrirModal } from './feedback.js';
import { aplicarMascaras, somenteNumeros } from './mascaras.js';
import {
  validarCampo,
  validarFormulario,
  limparEstados,
  dataMaximaNascimento,
  campoExigeValor,
  LIMITE_MENSAGEM,
  regras
} from './validacao.js';

const AJUDA_CEP = 'Endereço, cidade e estado são preenchidos automaticamente.';

/* ---------- Busca de endereço pelo CEP (ViaCEP) ------------------ */

const buscarEndereco = async (formulario, statusCep, aoPreencher) => {
  const cep = somenteNumeros(formulario.cep.value);
  if (cep.length !== 8) return;

  statusCep.textContent = 'Buscando endereço...';

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const dados = await resposta.json();

    if (dados.erro) {
      statusCep.textContent = 'CEP não encontrado. Preencha o endereço manualmente.';
      return;
    }

    if (dados.logradouro) formulario.endereco.value = `${dados.logradouro}, `;
    if (dados.localidade) formulario.cidade.value = dados.localidade;
    if (dados.uf) formulario.uf.value = dados.uf;

    statusCep.textContent = 'Endereço preenchido. Informe o número.';
    aoPreencher();

    const { endereco } = formulario;
    endereco.focus();
    endereco.setSelectionRange(endereco.value.length, endereco.value.length);
  } catch {
    statusCep.textContent = 'Não foi possível consultar o CEP. Preencha o endereço manualmente.';
  }
};

/* ---------- Eventos ---------------------------------------------- */

export const iniciarFormularioCadastro = (raiz) => {
  const formulario = raiz.querySelector('#form-cadastro');
  if (!formulario) return;

  const retorno = raiz.querySelector('#retorno');
  const statusCep = raiz.querySelector('#cep-status');
  const botaoEnviar = formulario.querySelector('button[type="submit"]');
  const ajudaMensagem = formulario.mensagem.closest('.campo').querySelector('.ajuda');

  // Campos que a pessoa já visitou: só eles são verificados enquanto ela digita
  const visitados = new Set();
  let limpezaAutomatica = false;

  // A idade mínima é calculada a partir da data de hoje
  formulario.nascimento.max = dataMaximaNascimento();

  aplicarMascaras(formulario);

  const verificar = (nome) => {
    if (regras[nome]) validarCampo(formulario, nome);
  };

  const atualizarBotaoEnviar = () => {
    botaoEnviar.disabled = !formulario.termos.checked;
  };

  const atualizarContador = () => {
    const restantes = LIMITE_MENSAGEM - formulario.mensagem.value.length;
    ajudaMensagem.textContent = `Restam ${restantes} de ${LIMITE_MENSAGEM} caracteres.`;
  };

  const mostrarRetorno = (texto, tipo) => {
    retorno.textContent = texto;
    retorno.className = tipo ? `retorno alerta alerta--${tipo}` : 'retorno';
  };

  // Delegação: um listener no formulário atende todos os campos
  formulario.addEventListener('focusout', (evento) => {
    const { name } = evento.target;
    if (!name || evento.target.type === 'radio') return;
    visitados.add(name);
    verificar(name);

    if (name === 'cep') {
      buscarEndereco(formulario, statusCep, () => {
        // Campos preenchidos pelo CEP já aparecem verificados
        ['cidade', 'uf'].forEach((campo) => { visitados.add(campo); verificar(campo); });
      });
    }
  });

  formulario.addEventListener('input', (evento) => {
    const { name } = evento.target;
    if (name === 'mensagem') atualizarContador();
    if (visitados.has(name)) verificar(name);
  });

  formulario.addEventListener('change', (evento) => {
    const { name, type } = evento.target;

    // Rádio, caixa de seleção e select são verificados assim que mudam
    if (type === 'radio' || type === 'checkbox' || evento.target.tagName === 'SELECT') {
      visitados.add(name);
      verificar(name);
    }

    if (name === 'termos') atualizarBotaoEnviar();

    // Regra entre campos: o perfil define se o valor da doação é obrigatório
    if (name === 'perfil') {
      formulario.valor.required = campoExigeValor(formulario.perfil.value);
      if (visitados.has('valor')) verificar('valor');
    }
  });

  formulario.addEventListener('submit', (evento) => {
    // Impede o envio padrão, que recarregaria a página e sairia da SPA
    evento.preventDefault();

    const erros = validarFormulario(formulario);
    Object.keys(regras).forEach((nome) => visitados.add(nome));

    if (erros.length) {
      const total = erros.length === 1 ? '1 campo precisa' : `${erros.length} campos precisam`;
      mostrarRetorno(`${total} de correção. Os problemas estão destacados em vermelho.`, 'erro');
      formulario.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    // O reset feito pelo próprio envio não deve gerar o toast de "limpo"
    limpezaAutomatica = true;
    formulario.reset();
    limpezaAutomatica = false;

    abrirModal('modal-sucesso');
  });

  formulario.addEventListener('reset', () => {
    if (!limpezaAutomatica) {
      toast('Formulário limpo. Você pode começar de novo.', 'info');
    }

    visitados.clear();
    mostrarRetorno('', null);
    statusCep.textContent = AJUDA_CEP;
    formulario.valor.required = false;

    // O evento reset acontece antes de os campos serem esvaziados
    setTimeout(() => {
      limparEstados(formulario);
      atualizarBotaoEnviar();
      atualizarContador();
    }, 0);
  });

  atualizarBotaoEnviar();
  atualizarContador();
};

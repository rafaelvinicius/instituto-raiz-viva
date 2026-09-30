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

   O preenchimento é salvo como rascunho no localStorage a cada
   alteração e restaurado quando a página abre. Os cadastros enviados
   ficam num histórico exibido ao lado do formulário.
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
  regras,
  lerDados
} from './validacao.js';
import {
  salvarRascunho,
  lerRascunho,
  restaurarRascunho,
  descartarRascunho,
  lerCadastros,
  registrarCadastro,
  apagarCadastros
} from './persistencia-cadastro.js';
import { historicoCadastros } from '../componentes/historico-cadastros.js';
import { carregarDatas, formatarDataHora } from '../utils/datas.js';

const AJUDA_CEP = 'Endereço, cidade e estado são preenchidos automaticamente.';
const ESPERA_SALVAMENTO = 400; // ms sem digitar antes de gravar o rascunho


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
  const areaHistorico = raiz.querySelector('#historico-cadastros');

  // Campos que a pessoa já visitou: só eles são verificados enquanto ela digita
  const visitados = new Set();
  let limpezaAutomatica = false;
  let temporizadorRascunho = null;

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

  const atualizarValorObrigatorio = () => {
    formulario.valor.required = campoExigeValor(formulario.perfil.value);
  };

  /* ---- localStorage ---- */

  // Grava só depois de uma pausa na digitação, e não a cada tecla
  const agendarRascunho = () => {
    clearTimeout(temporizadorRascunho);
    temporizadorRascunho = setTimeout(() => salvarRascunho(formulario), ESPERA_SALVAMENTO);
  };

  const cancelarRascunho = () => {
    clearTimeout(temporizadorRascunho);
    descartarRascunho();
  };

  const exibirHistorico = () => {
    areaHistorico.innerHTML = historicoCadastros(lerCadastros());
  };

  const recuperarRascunho = () => {
    const rascunho = lerRascunho();
    if (!rascunho) return;

    const restaurados = restaurarRascunho(formulario, rascunho);
    if (!restaurados.length) return;

    // Os campos recuperados já aparecem verificados (verde ou vermelho)
    restaurados.forEach((nome) => { visitados.add(nome); verificar(nome); });
    atualizarValorObrigatorio();

    toast(`Recuperamos o preenchimento salvo em ${formatarDataHora(rascunho.salvoEm)}. Por segurança, o CPF precisa ser digitado de novo.`, 'info');
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
    agendarRascunho();
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
      atualizarValorObrigatorio();
      if (visitados.has('valor')) verificar('valor');
    }

    agendarRascunho();
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

    // Envio concluído: entra no histórico e o rascunho deixa de ser necessário
    registrarCadastro(lerDados(formulario));
    cancelarRascunho();
    exibirHistorico();

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

    // Limpar o formulário também apaga o rascunho salvo
    cancelarRascunho();
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

  areaHistorico.addEventListener('click', (evento) => {
    if (!evento.target.closest('[data-apagar-historico]')) return;
    apagarCadastros();
    exibirHistorico();
    toast('Histórico de cadastros apagado deste navegador.', 'info');
  });

  // Carregamento inicial: restaura o que estava salvo no navegador
  exibirHistorico();
  // Quando o Day.js termina de carregar, o histórico passa a mostrar "há X minutos"
  carregarDatas().then((carregou) => {
    if (carregou && areaHistorico.isConnected) exibirHistorico();
  });
  recuperarRascunho();
  atualizarBotaoEnviar();
  atualizarContador();
};

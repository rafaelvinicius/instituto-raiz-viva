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

   O preenchimento é salvo como rascunho a cada alteração e
   restaurado quando a página abre. Os cadastros enviados ficam num
   histórico exibido ao lado do formulário.

   Este arquivo só coordena: as regras ficam em regras/, o acesso à
   rede e ao localStorage em servicos/ e o estado visual dos campos
   em campos-formulario.js.
   ================================================================== */

import { toast, abrirModal } from './feedback.js';
import { aplicarMascaras } from './mascaras.js';
import {
  lerDados,
  preencherCampos,
  validarCampo,
  validarFormulario,
  limparEstados
} from './campos-formulario.js';
import {
  regras,
  dataMaximaNascimento,
  exigeDoacao,
  LIMITE_MENSAGEM
} from '../regras/validacao.js';
import {
  salvarRascunho,
  lerRascunho,
  descartarRascunho,
  lerCadastros,
  registrarCadastro,
  apagarCadastros
} from '../servicos/cadastros.js';
import { consultarCep } from '../servicos/viacep.js';
import { historicoCadastros } from '../componentes/historico-cadastros.js';
import { carregarDatas, formatarDataHora } from '../utils/datas.js';

const AJUDA_CEP = 'Endereço, cidade e estado são preenchidos automaticamente.';
const ESPERA_SALVAMENTO = 400; // ms sem digitar antes de gravar o rascunho

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
    formulario.valor.required = exigeDoacao(formulario.perfil.value);
  };

  /* ---- localStorage ---- */

  // Grava só depois de uma pausa na digitação, e não a cada tecla
  const agendarRascunho = () => {
    clearTimeout(temporizadorRascunho);
    temporizadorRascunho = setTimeout(() => salvarRascunho(lerDados(formulario)), ESPERA_SALVAMENTO);
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

    const restaurados = preencherCampos(formulario, rascunho.campos);
    if (!restaurados.length) return;

    // Os campos recuperados já aparecem verificados (verde ou vermelho)
    restaurados.forEach((nome) => { visitados.add(nome); verificar(nome); });
    atualizarValorObrigatorio();

    toast(`Recuperamos o preenchimento salvo em ${formatarDataHora(rascunho.salvoEm)}. Por segurança, o CPF precisa ser digitado de novo.`, 'info');
  };

  /* ---- CEP (serviço ViaCEP) ---- */

  const preencherEndereco = async () => {
    if (formulario.cep.value.replace(/\D/g, '').length !== 8) return;

    statusCep.textContent = 'Buscando endereço...';

    try {
      const endereco = await consultarCep(formulario.cep.value);

      // A resposta pode chegar depois que a pessoa já saiu da página de
      // cadastro. Nesse caso o formulário não está mais no DOM e nada deve
      // ser preenchido, focado ou salvo.
      if (!formulario.isConnected) return;

      if (!endereco) {
        statusCep.textContent = 'CEP não encontrado. Preencha o endereço manualmente.';
        return;
      }

      preencherCampos(formulario, {
        endereco: endereco.logradouro ? `${endereco.logradouro}, ` : '',
        cidade: endereco.cidade,
        uf: endereco.uf
      });
      statusCep.textContent = 'Endereço preenchido. Informe o número.';

      // Cidade e estado preenchidos pelo CEP já aparecem verificados
      ['cidade', 'uf'].forEach((campo) => { visitados.add(campo); verificar(campo); });
      agendarRascunho();

      const campoEndereco = formulario.endereco;
      campoEndereco.focus();
      campoEndereco.setSelectionRange(campoEndereco.value.length, campoEndereco.value.length);
    } catch {
      if (!formulario.isConnected) return;
      statusCep.textContent = 'Não foi possível consultar o CEP. Preencha o endereço manualmente.';
    }
  };

  // Delegação: um listener no formulário atende todos os campos
  formulario.addEventListener('focusout', (evento) => {
    const { name } = evento.target;
    if (!name || evento.target.type === 'radio') return;
    visitados.add(name);
    verificar(name);

    if (name === 'cep') preencherEndereco();
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

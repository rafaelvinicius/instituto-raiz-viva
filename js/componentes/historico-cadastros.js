/* ==================================================================
   Componente: cadastros já enviados neste navegador
   Os dados vêm do localStorage, ou seja, foram digitados por uma
   pessoa. Por isso todo texto passa por escapar().
   ================================================================== */

import { escapar, renderizarLista } from '../utils/html.js';
import { formatarDataHora, tempoDecorrido } from '../utils/datas.js';

const PERFIS = {
  doador: 'Doação',
  voluntario: 'Voluntariado',
  ambos: 'Doação e voluntariado'
};

const itemCadastro = (cadastro) => {
  const perfil = PERFIS[cadastro.perfil] ?? 'Participação';
  const valor = cadastro.valor ? ` — R$ ${escapar(cadastro.valor)} por mês` : '';

  return `
    <li>
      <strong>${escapar(cadastro.nome)}</strong>
      <span>${escapar(perfil)}${valor}</span>
      <small>Enviado <time datetime="${escapar(cadastro.enviadoEm)}" title="${escapar(formatarDataHora(cadastro.enviadoEm))}">${escapar(tempoDecorrido(cadastro.enviadoEm))}</time></small>
    </li>`;
};

export const historicoCadastros = (cadastros) => {
  if (!cadastros.length) return '';

  return `
    <h3>Cadastros feitos neste navegador</h3>
    <ul class="historico__lista">
      ${renderizarLista(cadastros, itemCadastro)}
    </ul>
    <button type="button" class="botao botao--secundario" data-apagar-historico>
      Apagar histórico
    </button>`;
};

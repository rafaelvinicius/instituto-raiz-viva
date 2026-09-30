/* ==================================================================
   Testes automatizados dos módulos sem DOM
   Rodar na raiz do projeto:  node --test testes/
   Usa só o test runner nativo do Node (18+), sem instalar nada.
   ================================================================== */

import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { regras, cpfEhValido, verificarDados, exigeDoacao, dataMaximaNascimento } from '../js/regras/validacao.js';
import { formatadores } from '../js/interacoes/mascaras.js';
import { escapar } from '../js/utils/html.js';
import { calcularIdade } from '../js/utils/datas.js';

/* ---------- localStorage falso para os serviços ------------------ */
const memoria = new Map();
globalThis.localStorage = {
  getItem: (chave) => (memoria.has(chave) ? memoria.get(chave) : null),
  setItem: (chave, valor) => memoria.set(chave, String(valor)),
  removeItem: (chave) => memoria.delete(chave)
};
const cadastros = await import('../js/servicos/cadastros.js');
const { consultarCep } = await import('../js/servicos/viacep.js');

describe('regras de validação', () => {
  test('CPF: aceita válido e recusa dígitos errados ou repetidos', () => {
    assert.equal(cpfEhValido('529.982.247-25'), true);
    assert.equal(cpfEhValido('529.982.247-24'), false);
    assert.equal(cpfEhValido('111.111.111-11'), false);
    assert.equal(regras.cpf('52998224725'), 'Digite os 11 números do CPF.');
  });

  test('nome exige nome e sobrenome só com letras', () => {
    assert.equal(regras.nome('Maria Souza'), '');
    assert.notEqual(regras.nome('Maria'), '');
    assert.notEqual(regras.nome('M4ria Souza'), '');
    assert.notEqual(regras.nome(''), '');
  });

  test('e-mail, telefone e CEP seguem o formato', () => {
    assert.equal(regras.email('maria@exemplo.com.br'), '');
    assert.notEqual(regras.email('maria@'), '');
    assert.equal(regras.telefone('(11) 91234-5678'), '');
    assert.equal(regras.telefone('(11) 2654-0188'), '');
    assert.notEqual(regras.telefone('(11) 9123'), '');
    assert.equal(regras.cep('03342-000'), '');
    assert.notEqual(regras.cep('03342'), '');
  });

  test('endereço precisa ter número', () => {
    assert.equal(regras.endereco('Rua das Acácias, 214'), '');
    assert.equal(regras.endereco('Rua das Acácias'), 'Inclua o número do imóvel.');
  });

  test('idade mínima de 18 anos', () => {
    assert.equal(regras.nascimento('1990-01-01'), '');
    assert.equal(regras.nascimento(dataMaximaNascimento()), '');
    assert.notEqual(regras.nascimento('2015-06-10'), '');
    assert.equal(calcularIdade('2000-10-01', new Date(2026, 8, 30)), 25);
    assert.equal(calcularIdade('2000-09-30', new Date(2026, 8, 30)), 26);
  });

  test('doação: obrigatória só para quem vai doar, entre 10 e 10.000, múltipla de 5', () => {
    assert.equal(exigeDoacao('voluntario'), false);
    assert.equal(regras.valor('', { perfil: 'voluntario' }), '');
    assert.equal(regras.valor('', { perfil: 'doador' }), 'Informe o valor da doação mensal.');
    assert.equal(regras.valor('45', { perfil: 'ambos' }), '');
    assert.notEqual(regras.valor('47', { perfil: 'doador' }), '');
    assert.notEqual(regras.valor('5', { perfil: 'doador' }), '');
    assert.notEqual(regras.valor('20000', { perfil: 'doador' }), '');
  });

  test('verificarDados devolve só os campos com erro', () => {
    const erros = verificarDados({
      nome: 'Maria Souza', cpf: '529.982.247-25', nascimento: '1990-01-01',
      email: 'maria@ex.com', telefone: '(11) 91234-5678', cep: '03342-000',
      endereco: 'Rua A', cidade: 'São Paulo', uf: 'SP', perfil: 'doador',
      valor: '', mensagem: '', termos: 'aceito'
    });
    assert.deepEqual(Object.keys(erros).sort(), ['endereco', 'valor']);
  });
});

describe('máscaras', () => {
  test('formatam CPF, telefone e CEP', () => {
    assert.equal(formatadores.cpf('52998224725'), '529.982.247-25');
    assert.equal(formatadores.telefone('11912345678'), '(11) 91234-5678');
    assert.equal(formatadores.telefone('1126540188'), '(11) 2654-0188');
    assert.equal(formatadores.cep('03342000'), '03342-000');
  });
});

describe('templates', () => {
  test('escapar() neutraliza HTML', () => {
    assert.equal(escapar('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
  });
});

describe('serviço de cadastros (localStorage)', () => {
  beforeEach(() => memoria.clear());

  test('rascunho é gravado como JSON e nunca guarda CPF nem aceite', () => {
    cadastros.salvarRascunho({ nome: 'Maria Souza', cpf: '529.982.247-25', termos: 'aceito' });
    const salvo = JSON.parse(memoria.get('raizviva:rascunho-cadastro'));
    assert.deepEqual(salvo.campos, { nome: 'Maria Souza' });
    assert.deepEqual(cadastros.lerRascunho().campos, { nome: 'Maria Souza' });
  });

  test('rascunho vazio apaga o anterior', () => {
    cadastros.salvarRascunho({ nome: 'Maria Souza' });
    cadastros.salvarRascunho({ nome: '' });
    assert.equal(cadastros.lerRascunho(), null);
  });

  test('histórico não duplica o mesmo e-mail', () => {
    cadastros.registrarCadastro({ nome: 'Maria Souza', email: 'maria@ex.com', perfil: 'doador', valor: '45' });
    cadastros.registrarCadastro({ nome: 'Maria S. Lima', email: 'MARIA@ex.com', perfil: 'ambos', valor: '50' });
    const lista = cadastros.lerCadastros();
    assert.equal(lista.length, 1);
    assert.equal(lista[0].valor, 50);
  });

  test('JSON corrompido ou formato errado devolvem o valor padrão', () => {
    memoria.set('raizviva:cadastros', '{quebrado');
    assert.deepEqual(cadastros.lerCadastros(), []);
    memoria.set('raizviva:cadastros', '{"a":1}');
    assert.deepEqual(cadastros.lerCadastros(), []);
    memoria.set('raizviva:rascunho-cadastro', '[1,2]');
    assert.equal(cadastros.lerRascunho(), null);
  });
});

describe('serviço ViaCEP', () => {
  test('converte a resposta para o formato do projeto', async () => {
    globalThis.fetch = async () => ({ ok: true, json: async () => ({ logradouro: 'Av. Regente Feijó', localidade: 'São Paulo', uf: 'SP' }) });
    assert.deepEqual(await consultarCep('03342-000'), { logradouro: 'Av. Regente Feijó', cidade: 'São Paulo', uf: 'SP' });
  });

  test('CEP inexistente devolve null e falha de rede lança erro', async () => {
    globalThis.fetch = async () => ({ ok: true, json: async () => ({ erro: true }) });
    assert.equal(await consultarCep('00000-000'), null);
    globalThis.fetch = async () => ({ ok: false, status: 500 });
    await assert.rejects(consultarCep('03342-000'));
  });
});

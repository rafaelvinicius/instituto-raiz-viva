/* ==================================================================
   Página: Cadastro de doadores e voluntários
   O HTML do formulário é o mesmo da EP2. As opções de estado são
   geradas a partir de dados/estados.js e os eventos (máscaras,
   validação, envio) são ligados em aoMontar(), depois que o
   formulário já existe na página.
   ================================================================== */

import { escapar, renderizarLista } from '../utils/html.js';
import { caminhoPara } from '../roteador.js';
import { estados } from '../dados/estados.js';
import { iniciarFormularioCadastro } from '../interacoes/formulario-cadastro.js';

const opcaoEstado = ({ sigla, nome }) =>
  `<option value="${escapar(sigla)}">${escapar(nome)}</option>`;

export const cadastro = {
  titulo: 'Cadastro de doadores e voluntários — Instituto Raiz Viva',
  descricao:
    'Cadastre-se como doador ou voluntário do Instituto Raiz Viva e participe dos ' +
    'mutirões de plantio na zona leste de São Paulo.',
  cabecalho: {
    titulo: 'Cadastro de doadores e voluntários',
    lema: 'Leva menos de dois minutos. Entramos em contato em até dois dias úteis.'
  },

  renderizar: () => `
    <section class="intro intro--lateral">
      <h2>Antes de começar</h2>
      <p>
        Os campos marcados com <abbr title="obrigatório">*</abbr> são obrigatórios. Os
        dados são usados apenas para contato e emissão de recibo de doação, conforme a
        Lei Geral de Proteção de Dados.
      </p>
      <p>
        O que você digita fica salvo neste navegador até o envio, para não se perder
        se a página for fechada. O CPF não é salvo.
      </p>
      <div id="historico-cadastros" class="historico" aria-live="polite"></div>
    </section>

    <section class="formulario">
      <h2>Formulário de cadastro</h2>

      <form id="form-cadastro" action="#" method="post" novalidate>

        <fieldset>
          <legend>Dados pessoais</legend>

          <div class="campo">
            <label for="nome">Nome completo <abbr title="obrigatório">*</abbr></label>
            <input type="text" id="nome" name="nome"
                   autocomplete="name"
                   placeholder="Maria Aparecida de Souza"
                   minlength="6" maxlength="80"
                   pattern="[A-Za-zÀ-ÖØ-öø-ÿ']+(\\s[A-Za-zÀ-ÖØ-öø-ÿ']+)+"
                   title="Informe nome e sobrenome, apenas letras."
                   required>
          </div>

          <div class="campo campo--metade">
            <label for="cpf">CPF <abbr title="obrigatório">*</abbr></label>
            <input type="text" id="cpf" name="cpf"
                   inputmode="numeric"
                   placeholder="000.000.000-00"
                   maxlength="14"
                   pattern="\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}"
                   title="Digite os 11 números do CPF."
                   data-mascara="cpf"
                   required>
            <small class="ajuda">Necessário apenas para emissão do recibo de doação.</small>
          </div>

          <div class="campo campo--metade">
            <label for="nascimento">Data de nascimento <abbr title="obrigatório">*</abbr></label>
            <input type="date" id="nascimento" name="nascimento"
                   autocomplete="bday"
                   min="1920-01-01" max="2008-12-31"
                   required>
            <small class="ajuda">É preciso ter 18 anos ou mais para participar dos mutirões.</small>
          </div>

          <div class="campo campo--longo">
            <label for="email">E-mail <abbr title="obrigatório">*</abbr></label>
            <input type="email" id="email" name="email"
                   autocomplete="email"
                   placeholder="maria@exemplo.com.br"
                   maxlength="120"
                   required>
          </div>

          <div class="campo campo--curto">
            <label for="telefone">Telefone celular <abbr title="obrigatório">*</abbr></label>
            <input type="tel" id="telefone" name="telefone"
                   autocomplete="tel"
                   inputmode="numeric"
                   placeholder="(11) 90000-0000"
                   maxlength="15"
                   pattern="\\(\\d{2}\\)\\s\\d{4,5}-\\d{4}"
                   title="Informe DDD e número, com 10 ou 11 dígitos."
                   data-mascara="telefone"
                   required>
            <small class="ajuda">Usamos o WhatsApp para avisar sobre os mutirões.</small>
          </div>
        </fieldset>

        <fieldset>
          <legend>Endereço</legend>

          <div class="campo campo--curto">
            <label for="cep">CEP <abbr title="obrigatório">*</abbr></label>
            <input type="text" id="cep" name="cep"
                   autocomplete="postal-code"
                   inputmode="numeric"
                   placeholder="00000-000"
                   maxlength="9"
                   pattern="\\d{5}-\\d{3}"
                   title="Digite os 8 números do CEP."
                   data-mascara="cep"
                   required>
            <small class="ajuda" id="cep-status">Endereço, cidade e estado são preenchidos automaticamente.</small>
          </div>

          <div class="campo campo--longo">
            <label for="endereco">Endereço <abbr title="obrigatório">*</abbr></label>
            <input type="text" id="endereco" name="endereco"
                   autocomplete="address-line1"
                   placeholder="Rua das Acácias, 214"
                   maxlength="120"
                   required>
            <small class="ajuda">Rua e número. Inclua o complemento, se houver.</small>
          </div>

          <div class="campo campo--longo">
            <label for="cidade">Cidade <abbr title="obrigatório">*</abbr></label>
            <input type="text" id="cidade" name="cidade"
                   autocomplete="address-level2"
                   maxlength="60"
                   required>
          </div>

          <div class="campo campo--curto">
            <label for="uf">Estado <abbr title="obrigatório">*</abbr></label>
            <select id="uf" name="uf" autocomplete="address-level1" required>
              <option value="">Selecione</option>
              ${renderizarLista(estados, opcaoEstado)}
            </select>
          </div>
        </fieldset>

        <fieldset>
          <legend>Participação</legend>

          <fieldset class="grupo-opcoes">
            <legend>Como você quer contribuir <abbr title="obrigatório">*</abbr></legend>

            <div class="opcao">
              <input type="radio" id="perfil-doador" name="perfil" value="doador" required>
              <label for="perfil-doador">Doando</label>
            </div>
            <div class="opcao">
              <input type="radio" id="perfil-voluntario" name="perfil" value="voluntario">
              <label for="perfil-voluntario">Como voluntário nos mutirões</label>
            </div>
            <div class="opcao">
              <input type="radio" id="perfil-ambos" name="perfil" value="ambos">
              <label for="perfil-ambos">Das duas formas</label>
            </div>
          </fieldset>

          <div class="campo campo--curto">
            <label for="valor">Doação mensal (R$)</label>
            <input type="number" id="valor" name="valor"
                   min="10" max="10000" step="5"
                   placeholder="45">
            <small class="ajuda">Mínimo de R$ 10. Deixe em branco se for apenas voluntário.</small>
          </div>

          <div class="campo">
            <label for="mensagem">Conte como quer contribuir</label>
            <textarea id="mensagem" name="mensagem" rows="4" maxlength="500"
                      placeholder="Tenho experiência com jardinagem e posso ajudar no viveiro aos sábados."></textarea>
            <small class="ajuda">Até 500 caracteres.</small>
          </div>
        </fieldset>

        <fieldset>
          <legend>Confirmação</legend>

          <div class="opcao">
            <input type="checkbox" id="termos" name="termos" value="aceito" required>
            <label for="termos">
              Li e aceito a política de privacidade e autorizo o contato do instituto
              <abbr title="obrigatório">*</abbr>
            </label>
          </div>

          <div class="opcao">
            <input type="checkbox" id="newsletter" name="newsletter" value="sim">
            <label for="newsletter">Quero receber o boletim trimestral por e-mail</label>
          </div>

          <p id="ajuda-envio" class="ajuda">
            O botão de envio é liberado depois que você aceita a política de privacidade.
          </p>

          <div class="acoes">
            <button type="submit" class="botao" aria-describedby="ajuda-envio">Enviar cadastro</button>
            <button type="reset" class="botao botao--secundario">Limpar formulário</button>
          </div>
        </fieldset>

      </form>

      <p id="retorno" class="retorno" role="status"></p>
    </section>

    <dialog id="modal-sucesso" class="modal" aria-labelledby="modal-sucesso-titulo">
      <div class="modal__conteudo">
        <div class="modal__cabecalho">
          <h2 id="modal-sucesso-titulo" class="modal__titulo">Cadastro recebido</h2>
          <button type="button" class="botao-fechar" data-fechar-modal aria-label="Fechar">&times;</button>
        </div>
        <p>Obrigado por se cadastrar. Entramos em contato em até dois dias úteis.</p>
        <ul class="lista-valores">
          <li><strong>Voluntários:</strong> a próxima etapa é a conversa de boas-vindas, on-line, com duração de 40 minutos.</li>
          <li><strong>Doadores:</strong> o recibo é emitido em até cinco dias úteis.</li>
        </ul>
        <div class="modal__rodape">
          <a class="botao botao--secundario" href="${caminhoPara('/projetos')}">Conhecer os projetos</a>
          <button type="button" class="botao" data-fechar-modal>Fechar</button>
        </div>
      </div>
    </dialog>`,

  aoMontar: (raiz) => iniciarFormularioCadastro(raiz)
};

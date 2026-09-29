/*
 * Instituto Raiz Viva — máscaras de entrada e validações do formulário de cadastro.
 * Sem dependências externas.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   * 1. Máscaras de entrada
   * ------------------------------------------------------------------ */

  var somenteNumeros = function (valor) {
    return valor.replace(/\D/g, '');
  };

  var formatadores = {
    cpf: function (valor) {
      var n = somenteNumeros(valor).slice(0, 11);
      if (n.length > 9) {
        return n.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
      }
      if (n.length > 6) {
        return n.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
      }
      if (n.length > 3) {
        return n.replace(/(\d{3})(\d{1,3})/, '$1.$2');
      }
      return n;
    },

    telefone: function (valor) {
      var n = somenteNumeros(valor).slice(0, 11);
      if (n.length > 10) {
        return n.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
      }
      if (n.length > 6) {
        return n.replace(/(\d{2})(\d{4})(\d{1,4})/, '($1) $2-$3');
      }
      if (n.length > 2) {
        return n.replace(/(\d{2})(\d{1,5})/, '($1) $2');
      }
      if (n.length > 0) {
        return '(' + n;
      }
      return n;
    },

    cep: function (valor) {
      var n = somenteNumeros(valor).slice(0, 8);
      if (n.length > 5) {
        return n.replace(/(\d{5})(\d{1,3})/, '$1-$2');
      }
      return n;
    }
  };

  var camposComMascara = document.querySelectorAll('[data-mascara]');

  Array.prototype.forEach.call(camposComMascara, function (campo) {
    var tipo = campo.getAttribute('data-mascara');
    var formatar = formatadores[tipo];
    if (!formatar) { return; }

    campo.addEventListener('input', function () {
      var posicao = campo.selectionStart;
      var tamanhoAnterior = campo.value.length;

      campo.value = formatar(campo.value);
      campo.setCustomValidity('');

      // Mantém o cursor no lugar quando o usuário edita no meio do texto.
      if (posicao < tamanhoAnterior) {
        var diferenca = campo.value.length - tamanhoAnterior;
        campo.setSelectionRange(posicao + diferenca, posicao + diferenca);
      }
    });

    campo.addEventListener('blur', function () {
      campo.value = formatar(campo.value);
    });
  });

  /* ------------------------------------------------------------------ *
   * 2. Validação dos dígitos verificadores do CPF
   * ------------------------------------------------------------------ */

  var cpfEhValido = function (valor) {
    var n = somenteNumeros(valor);
    if (n.length !== 11) { return false; }
    if (/^(\d)\1{10}$/.test(n)) { return false; }

    var calcularDigito = function (quantidade) {
      var soma = 0;
      var peso = quantidade + 1;
      for (var i = 0; i < quantidade; i += 1) {
        soma += parseInt(n.charAt(i), 10) * (peso - i);
      }
      var resto = (soma * 10) % 11;
      return resto === 10 ? 0 : resto;
    };

    return calcularDigito(9) === parseInt(n.charAt(9), 10) &&
           calcularDigito(10) === parseInt(n.charAt(10), 10);
  };

  var campoCpf = document.getElementById('cpf');

  if (campoCpf) {
    campoCpf.addEventListener('blur', function () {
      if (campoCpf.value === '') {
        campoCpf.setCustomValidity('');
        return;
      }
      if (!cpfEhValido(campoCpf.value)) {
        campoCpf.setCustomValidity('Este CPF não existe. Confira os números digitados.');
      } else {
        campoCpf.setCustomValidity('');
      }
      campoCpf.reportValidity();
    });
  }

  /* ------------------------------------------------------------------ *
   * 3. Busca de endereço pelo CEP (ViaCEP)
   * ------------------------------------------------------------------ */

  var campoCep = document.getElementById('cep');
  var statusCep = document.getElementById('cep-status');

  var preencherEndereco = function (dados) {
    var mapa = {
      endereco: dados.logradouro,
      cidade: dados.localidade,
      uf: dados.uf
    };

    Object.keys(mapa).forEach(function (id) {
      var campo = document.getElementById(id);
      if (campo && mapa[id]) {
        campo.value = mapa[id];
      }
    });
  };

  if (campoCep) {
    campoCep.addEventListener('blur', function () {
      var cep = somenteNumeros(campoCep.value);

      if (cep.length !== 8) { return; }
      if (!window.fetch) { return; }

      if (statusCep) { statusCep.textContent = 'Buscando endereço...'; }

      window.fetch('https://viacep.com.br/ws/' + cep + '/json/')
        .then(function (resposta) { return resposta.json(); })
        .then(function (dados) {
          if (dados.erro) {
            if (statusCep) { statusCep.textContent = 'CEP não encontrado. Preencha o endereço manualmente.'; }
            return;
          }
          preencherEndereco(dados);
          if (statusCep) { statusCep.textContent = 'Endereço preenchido. Informe o número.'; }
          var endereco = document.getElementById('endereco');
          if (endereco && endereco.value) {
            endereco.value = endereco.value + ', ';
            endereco.focus();
            endereco.setSelectionRange(endereco.value.length, endereco.value.length);
          }
        })
        .catch(function () {
          if (statusCep) { statusCep.textContent = 'Não foi possível consultar o CEP. Preencha o endereço manualmente.'; }
        });
    });
  }

  /* ------------------------------------------------------------------ *
   * 4. Envio: validação nativa + mensagem de retorno
   * ------------------------------------------------------------------ */

  var formulario = document.getElementById('form-cadastro');
  var retorno = document.getElementById('retorno');

  if (formulario) {
    formulario.addEventListener('submit', function (evento) {
      evento.preventDefault();

      if (campoCpf && campoCpf.value !== '' && !cpfEhValido(campoCpf.value)) {
        campoCpf.setCustomValidity('Este CPF não existe. Confira os números digitados.');
      }

      if (!formulario.checkValidity()) {
        formulario.reportValidity();
        if (retorno) {
          retorno.textContent = 'Alguns campos precisam de correção antes do envio.';
          retorno.className = 'retorno retorno--erro';
        }
        return;
      }

      if (retorno) {
        retorno.textContent = 'Cadastro enviado. Entramos em contato em até dois dias úteis.';
        retorno.className = 'retorno retorno--sucesso';
      }
      formulario.reset();
    });

    formulario.addEventListener('reset', function () {
      if (retorno) {
        retorno.textContent = '';
        retorno.className = 'retorno';
      }
      if (statusCep) {
        statusCep.textContent = 'Endereço, cidade e estado são preenchidos automaticamente.';
      }
      if (campoCpf) {
        campoCpf.setCustomValidity('');
      }
    });
  }
}());

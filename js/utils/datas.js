/* ==================================================================
   Datas com a biblioteca Day.js (https://day.js.org)
   ------------------------------------------------------------------
   Uso no projeto:
   - idade exata a partir da data de nascimento (validação do cadastro);
   - tempo relativo no histórico de cadastros ("há 5 minutos").

   Como a biblioteca é acoplada sem conflitos:
   - vem do CDN jsDelivr como módulo ES (+esm). Nada é criado no
     escopo global (window); o dayjs só existe dentro deste arquivo;
   - a versão é fixa, para que uma atualização da biblioteca não mude
     o comportamento do site sem aviso;
   - o carregamento usa import() dinâmico, fora da cadeia de imports
     do app. Se o CDN estiver fora do ar ou bloqueado, o site continua
     funcionando com as funções nativas (Date e Intl) abaixo.
   ================================================================== */

const VERSAO = '1.11.23';
const CDN = `https://cdn.jsdelivr.net/npm/dayjs@${VERSAO}`;

// Textos em português do plugin relativeTime (mesmos do locale pt-br do Day.js)
const PT_BR = {
  name: 'pt-br',
  relativeTime: {
    future: 'em %s', past: 'há %s', s: 'poucos segundos',
    m: 'um minuto', mm: '%d minutos', h: 'uma hora', hh: '%d horas',
    d: 'um dia', dd: '%d dias', M: 'um mês', MM: '%d meses',
    y: 'um ano', yy: '%d anos'
  }
};

let dayjs = null;

/** Carrega o Day.js e o plugin relativeTime. Resolve true se deu certo. */
export const carregarDatas = (() => {
  let promessa = null;

  return () => {
    promessa ??= Promise.all([
      import(`${CDN}/+esm`),
      import(`${CDN}/plugin/relativeTime.js/+esm`)
    ])
      .then(([biblioteca, plugin]) => {
        const instancia = biblioteca.default;
        instancia.extend(plugin.default);
        instancia.locale(PT_BR);
        dayjs = instancia;
        return true;
      })
      .catch(() => false);   // sem a biblioteca, valem as funções nativas

    return promessa;
  };
})();

export const bibliotecaCarregada = () => dayjs !== null;

/* ---------- Funções usadas pelo site ----------------------------- */

/** Idade completa em anos. Ex.: '1990-10-01' → 35 (em 29/09/2026). */
export const calcularIdade = (dataIso, hoje = new Date()) => {
  if (dayjs) {
    return dayjs(hoje).diff(dayjs(dataIso), 'year');
  }

  const [ano, mes, dia] = dataIso.split('-').map(Number);
  const mesAtual = hoje.getMonth() + 1;
  const aindaNaoFezAniversario = mesAtual < mes || (mesAtual === mes && hoje.getDate() < dia);
  return hoje.getFullYear() - ano - (aindaNaoFezAniversario ? 1 : 0);
};

/** Data e hora por extenso curto. Ex.: '29/09/2026, 21:10'. */
export const formatarDataHora = (iso) =>
  new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

/** Tempo desde a data. Ex.: 'há 5 minutos'. Sem a biblioteca, a data completa. */
export const tempoDecorrido = (iso) =>
  dayjs ? dayjs(iso).fromNow() : `em ${formatarDataHora(iso)}`;

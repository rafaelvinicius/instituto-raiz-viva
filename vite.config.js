/* ==================================================================
   Build de produção com Vite
   ------------------------------------------------------------------
   npm run build gera a pasta dist/, que é a versão publicada:
   - JavaScript: os módulos ES são agrupados e minificados;
   - CSS: minificado;
   - HTML: minificado pelo html-minifier-terser (plugin abaixo), já
     que o Vite não minifica HTML por padrão;
   - imagens: copiadas para dist/imagens, porque o JavaScript monta os
     caminhos das fotos em tempo de execução (js/config.js).
   ================================================================== */

import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { copyFileSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { minify } from 'html-minifier-terser';

const raiz = import.meta.dirname;
const saida = resolve(raiz, 'dist');

// Copia a pasta de imagens sem renomear os arquivos
const copiarImagens = () => ({
  name: 'copiar-imagens',
  apply: 'build',
  closeBundle() {
    const origem = resolve(raiz, 'imagens');
    const destino = resolve(saida, 'imagens');
    mkdirSync(destino, { recursive: true });
    for (const nome of readdirSync(origem)) {
      if (nome.startsWith('.')) continue;        // ignora .DS_Store
      copyFileSync(resolve(origem, nome), resolve(destino, nome));
    }
  }
});

// Lista os .html gerados em dist/, inclusive em subpastas
const arquivosHtml = (pasta) => readdirSync(pasta).flatMap((nome) => {
  const caminho = resolve(pasta, nome);
  if (statSync(caminho).isDirectory()) return arquivosHtml(caminho);
  return nome.endsWith('.html') ? [caminho] : [];
});

// Minifica o HTML depois que o Vite já inseriu os links dos arquivos
const minificarHtml = () => ({
  name: 'minificar-html',
  apply: 'build',
  enforce: 'post',
  async closeBundle() {
    for (const arquivo of arquivosHtml(saida)) {
      const original = readFileSync(arquivo, 'utf8');
      const reduzido = await minify(original, {
        collapseWhitespace: true,
        conservativeCollapse: true,   // mantém um espaço entre elementos de texto
        removeComments: true,
        removeRedundantAttributes: true,
        minifyCSS: true,
        minifyJS: true                // script do tema no <head>
      });
      writeFileSync(arquivo, reduzido);
    }
  }
});

export default defineConfig({
  // Caminhos relativos: o site é publicado em /instituto-raiz-viva/
  // no GitHub Pages, e não na raiz do domínio.
  base: './',
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
    rollupOptions: {
      input: {
        redirecionamento: resolve(raiz, 'index.html'),
        app: resolve(raiz, 'html/index.html'),
        componentes: resolve(raiz, 'html/componentes.html')
      },
      output: {
        // Nomes legíveis + hash do conteúdo (cache longo e seguro)
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/compartilhado-[hash].js',
        assetFileNames: (arquivo) =>
          arquivo.names?.[0]?.endsWith('.css')
            ? 'assets/style-[hash][extname]'
            : 'assets/[name]-[hash][extname]'
      }
    }
  },
  plugins: [copiarImagens(), minificarHtml()]
});

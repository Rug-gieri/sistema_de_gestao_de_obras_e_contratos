# Sistema de Gestão de Contratos e Obras — Prefeitura de Porto Velho

![Versão](https://img.shields.io/badge/versão-2026.0-blue?style=flat-square)
![Status](https://img.shields.io/badge/status-testes-yellow?style=flat-square)
![Licença](https://img.shields.io/badge/licença-MIT-green?style=flat-square)

> **⚠️ Versão de testes** — Desenvolvido pela SEMEC (Secretaria Municipal de Educação e Cultura).

Sistema web para gestão de contratos e obras da Prefeitura Municipal de Porto Velho/RO, voltado à remessa mensal de dados ao TCE-RO (Tribunal de Contas do Estado de Rondônia) e integração com o **PNCP** (Portal Nacional de Contratações Públicas).

---

## 📋 Índice

- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Estrutura de Dados](#estrutura-de-dados)
- [Como Usar](#como-usar)
- [Capturas de Tela](#capturas-de-tela)
- [Melhorias Futuras](#melhorias-futuras)
- [Roadmap](#roadmap)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## Funcionalidades

O sistema é organizado em **8 módulos (fluxos)**:

| Fluxo | Módulo | Descrição |
|-------|--------|-----------|
| **A** | Novos Contratos | Cadastro de contratos, convênios, termos de adesão, acordos de cooperação, comodatos, arrendamentos, concessões, empenhos e outros. Designação de fiscais e gestores. |
| **B** | Novas Obras | Registro de obras públicas com detalhamento técnico, localização geográfica (município, CEI/CNO), tipo de serviço e anexação de documentos. |
| **C** | Acompanhamento de Contratos | Registro de alterações contratuais — termos aditivos e apostilamentos — com valores, histórico e documentação anexada. |
| **D** | Acompanhamento de Obras | Medições de execução física e financeira, percentual de conclusão, percentual acumulado e relatórios fotográficos. |
| **E** | Exoneração Fiscal | Encerramento de designação de agentes fiscais e gestores com registro da baixa. |
| **F** | Situação do Contrato | Atualização do status dos instrumentos contratuais (em andamento, concluído, cancelado, etc.). |
| **G** | Dashboard | Painel com indicadores estatísticos, gráficos de evolução mensal (quantidade e valores financeiros) e comparação entre categorias. |
| **H** | Exportação | Geração de remessa mensal em formato ZIP contendo arquivos XML estruturados conforme o layout do TCE-RO (v2026.0). |

### Funcionalidades Técnicas

- ✅ Máscaras de entrada para **CNPJ** e **CPF**
- ✅ Campos condicionais (ex.: vigência indeterminada oculta data de término)
- ✅ Validação visual de campos obrigatórios (indicação com `*` e borda vermelha)
- ✅ Formatação de valores em **Real (R$)** com locale `pt-BR`
- ✅ Designação de agentes: Fiscal titular, Fiscal suplente, Gestor titular e Gestor suplente
- ✅ Classificação por natureza do cargo (Efetivo, Comissionado, Terceirizado)
- ✅ Tipos de instrumento: Contrato, Convênio, Acordo de Cooperação, Termo de Adesão, Carta Contrato, Comodato, Arrendamento, Concessão, Empenho e Outros

---

## Pré-requisitos

- Navegador moderno (Chrome 90+, Firefox 88+, Edge 90+, Safari 14+)
- Sem dependência de backend — roda 100% no navegador (client-side only)

### Desenvolvimento Local (opcional)

Para servir os arquivos via HTTP local (necessário para algumas funcionalidades de arquivo):

```bash
# Opção 1: Python 3
python3 -m http.server 8080

# Opção 2: Node.js (npx serve)
npx serve .

# Opção 3: PHP
php -S localhost:8080
```

Acesse `http://localhost:8080` no navegador.

---

## Tecnologias

| Tecnologia | Uso |
|------------|-----|
| **HTML5** | Estrutura semântica |
| **CSS3** | Estilização responsiva (Flexbox, Grid, Media Queries) |
| **JavaScript (ES6+)** | Lógica da aplicação, SPAs, manipulação DOM |
| **Chart.js** | Gráficos interativos no dashboard (via CDN) |
| **jszip** | Geração de arquivos ZIP para exportação (via CDN) |
| **Google Fonts** | Fontes Montserrat e Open Sans |
| **Layout TCE-RO v2026.0** | Referência para estrutura XML de exportação (`Layouts-Arquivos-TCERO-Municipio-v.2026.0.xlsx`) |

### Características da Arquitetura

- **SPA (Single Page Application)** — Navegação sem recarregar a página
- **Sem framework** — Vanilla JS puro
- **Sem backend** — Dados gerenciados em memória JavaScript
- **Design responsivo** — Compatível com desktop, tablet e mobile
- **Modo claro** — Interface com alto contraste e paleta institucional (azul)

---

## Estrutura do Projeto

```
📁 sistema_de_gestao_de_obras_e_contratos/
│
├── 📄 index.html                    # Aplicação principal (SPA — ~1000 linhas)
├── 📁 styles/
│   └── 📄 style.css                 # Estilos completos (~1090 linhas)
├── 📁 assets/
│   ├── 🖼️ logo.png                  # Logo da Prefeitura de Porto Velho
│   └── 🖼️ favicon.ico               # Ícone do site (32x32 px)
├── 📄 Layouts-Arquivos-TCERO-Municipio-v.2026.0.xlsx  # Layout oficial TCE-RO
├── 📄 screenshots/
│   ├── 🖼️ dashboard.png            # Captura da tela do Dashboard
│   ├── 🖼️ novo-contrato.png        # Captura do formulário de Novos Contratos
│   ├── 🖼️ exportacao.png           # Captura da tela de Exportação
│   └── 🖼️ acompanhamento.png       # Captura do Acompanhamento de Obras
└── 📄 README.md                     # Este arquivo
```

---

## Estrutura de Dados (em memória)

Todas as coleções são arrays JavaScript gerenciados no objeto global `DB`. Os dados são perdidos ao recarregar a página (*persistência futura planejada*).

| Coleção | Descrição | Campos principais |
|---------|-----------|-------------------|
| `rolContratos` | Instrumentos contratuais | CNPJ UG, ID PNCP, tipo, categoria, valor, vigência, data assinatura |
| `fiscalGestor` | Agentes fiscais e gestores | Tipo agente, nome, CPF/CNPJ, cargo, designação, publicação |
| `rolObras` | Obras públicas cadastradas | Instrumento, tipo obra, serviço, município, CEI/CNO, tamanho |
| `respTecnico` | Responsáveis técnicos | Nome, CREA, CPF, obra vinculada |
| `acompContratos` | Termos aditivos / apostilamentos | Nº alteração, tipo (aditivo/apostilamento), valor acréscimo, arquivo |
| `acompanhamentoObras` | Medições de obras | Nº medição, data, valor, %, acumulado, situação |
| `exoneracaoFiscal` | Encerramento de designações | Agente, motivo, data baixa |
| `situacaoContrato` | Atualizações de status | Status (ativo/suspenso/concluído), data alteração |

---

## Como Usar

### 1. Acesso Online

🔗 **URL de produção:** [https://sistema-de-gestao-de-obras-e-contratos.vercel.app/](https://sistema-de-gestao-de-obras-e-contratos.vercel.app/)

### 2. Executar Localmente

```bash
# Clone ou baixe o projeto
cd sistema_de_gestao_de_obras_e_contratos

# Inicie um servidor HTTP local
python3 -m http.server 8080

# Acesse no navegador
# http://localhost:8080
```

### 3. Fluxo de Trabalho Recomendado

1. **Cadastre os contratos** (Fluxo A) e **obras** (Fluxo B)
2. **Designe fiscais/gestores** no formulário de novos contratos
3. **Registre alterações** (aditivos/apostilamentos) conforme necessário (Fluxo C)
4. **Acompanhe as obras** com medições periódicas (Fluxo D)
5. **Monitore o painel** de indicadores no Dashboard
6. **Exporte a remessa mensal** selecionando mês/ano → Geração de arquivos

### 4. Exportação de Dados

- Acesse o botão **"Exportar"** no cabeçalho
- Selecione o **mês** e **ano** de referência
- Clique em **"📦 Gerar Remessa Completa"**
- O sistema gera um arquivo **ZIP** contendo:
  - Arquivos XML estruturados conforme layout TCE-RO 2026.0
  - Anexos PDF referentes aos contratos cadastrados

---

## Capturas de Tela

<!-- Adicione capturas reais nas pastas indicadas acima -->

| Tela | Descrição |
|------|-----------|
| ![Dashboard](./screenshots/dashboard.png) | Painel de indicadores com gráficos de evolução mensal |
| ![Novo Contrato](./screenshots/novo-contrato.png) | Formulário de cadastro de contrato com designação de fiscal |
| ![Exportação](./screenshots/exportacao.png) | Modal de exportação com seleção de mês/ano |
| ![Acompanhamento](./screenshots/acompanhamento.png) | Medições de acompanhamento de obras |

> **📌 Nota:** As capturas de tela serão adicionadas em breve.

---

## Melhorias Futuras

### Prioridade Alta 🔴

- [x] ~~Implementação de camada persistente~~ → **Planejado:** `localStorage` + exportação JSON
- [ ] **Exportação ZIP completa** — Gerar XML + PDF compactado conforme especificação TCE-RO
- [ ] **Validação de CNPJ/CPF** — Algoritmo de verificação dos dígitos verificadores
- [ ] **Persistência local** — Salvar/carregar dados do `localStorage` automaticamente

### Prioridade Média 🟡

- [ ] **Backend / API** — Camada de servidor (Node.js/Python) com banco de dados PostgreSQL
- [ ] **Autenticação** — Controle de acesso por perfil (administrador, fiscal, gestor, visualizador)
- [ ] **Importação de dados** — Ler layout XLSX do TCE-RO para pré-preenchimento em lote
- [ ] **Acessibilidade (a11y)** — Labels ARIA, roles semânticas, contraste WCAG AA, navegação por teclado
- [ ] **Cálculo automático de prazos** — Calcular vigência a partir de datas início/término
- [ ] **Notificações** — Alertas de vencimento de contratos, prazos de medição e pendências

### Prioridade Baixa 🟢

- [ ] **Gráficos por período customizável** — Permitir selecionar intervalo de datas no dashboard
- [ ] **Internacionalização (i18n)** — Preparar estrutura para múltiplos idiomas
- [ ] **Modo offline (PWA)** — Service Worker para funcionamento sem internet
- [ ] **Testes automatizados** — Testes unitários (Jest/Vitest) e de integração para regras de negócio
- [ ] **Versionamento de exportações** — Histórico de remessas geradas com possibilidade de re-exportação
- [ ] **Upload de múltiplos arquivos** — Anexar vários documentos por registro (PDFs, imagens)
- [ ] **Relatórios PDF** — Geração de relatórios em PDF diretamente no navegador

---

## Roadmap

```
v1.0 (2026-Q2) ──► Persistência localStorage + Exportação ZIP funcional
v1.5 (2026-Q3) ──► Validação CPF/CNPJ + Importação XLSX + Notificações
v2.0 (2026-Q4) ──► Backend API + Autenticação + Banco de dados
v2.5 (2027-Q1) ──► PWA + Testes automatizados + Acessibilidade WCAG AA
```

---

## Contribuição

Contribuições são bem-vindas! Para propor melhorias ou reportar problemas:

1. **Abra uma issue** descrevendo a funcionalidade ou bug encontrado
2. **Faça um fork** do repositório
3. **Crie uma branch** para sua feature: `git checkout -b feature/minha-feature`
4. **Commit** suas alterações: `git commit -m "feat: descrição da mudança"`
5. **Push** para sua branch: `git push origin feature/minha-feature`
6. **Abra um Pull Request** com descrição detalhada das alterações

### Padrões de Código
- Variáveis e funções em **camelCase**
- Templates HTML com indentação de 2 espaços
- Comentários em JSDoc para funções complexas
- Mensagens de commit em inglês seguindo [Conventional Commits](https://www.conventionalcommits.org/)

---

## Licença

Este projeto está licenciado sob a **[MIT License](LICENSE)**.

---

## Contato

- **Secretaria:** SEMEC — Secretaria Municipal de Educação e Cultura
- **Prefeitura:** Prefeitura Municipal de Porto Velho/RO
- **Portal de Transparência:** [transparencia.portovelho.ro.gov.br](https://transparencia.portovelho.ro.gov.br/)
- **Ouvidoria:** [ouvidoria.portovelho.ro.gov.br](https://ouvidoria.portovelho.ro.gov.br/)
- **Site Oficial:** [portovelho.ro.gov.br](https://www.portovelho.ro.gov.br/)

---

> Desenvolvido com ❤️ pela equipe da SEMEC — Porto Velho, Rondônia
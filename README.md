# Sistema de Gestão de Obras e Contratos

Sistema web para gestão de obras públicas e contratos, desenvolvido para atender aos requisitos do TCE-RO (Tribunal de Contas do Estado de Rondônia).

## Tech Stack

- **Vue 3** + **TypeScript** + **Vite**
- **Pinia** para gerenciamento de estado (persistido em localStorage)
- **Vue Router 4** para rotas
- **Chart.js** para gráficos no dashboard
- **JSZip** para geração de ZIPs na exportação XML

## Estrutura do Projeto

```
src/
├── main.ts                      # Entry point
├── App.vue                      # Layout raiz + router-view
├── router/index.ts              # Definição de rotas
├── stores/
│   ├── useDB.ts                 # Store principal (coleções + file banks)
│   └── useToast.ts              # Store de notificações toast
├── types/index.ts               # Interfaces TypeScript
├── utils/
│   ├── constants.ts             # Enums/labels
│   ├── format.ts                # fmtDt, fmtBRL, digits, uid, etc.
│   └── xml-builders/            # Builders XML (layout TCE-RO)
├── composables/useMasks.ts      # maskCNPJ, maskCPF, maskCEP
├── components/
│   ├── layout/                  # AppHeader, Sidebar, AppFooter, SidebarOverlay
│   ├── shared/                  # UploadBox, ToastMessage
│   └── export/ExportModal.vue   # Geração de ZIP para exportação
└── pages/                       # Uma página por rota
```

## Rodando localmente

```bash
npm install
npm run dev        # servidor dev em http://localhost:5173
npm run build      # build de produção em dist/
npm run preview    # preview do build de produção
```

## Coleções de dados (Pinia store)

`useDB()` expõe: `rolContratos`, `fiscalGestor`, `rolObras`, `respTecnico`, `acompContratos`, `acompObras`, `exoneracaoFiscal`, `situacaoContrato`. Todos persistidos automaticamente em localStorage.

## Exportação XML

- `ExportModal.vue` gera ZIP com arquivos XML no layout TCE-RO v2026.0
- Cada builder XML segue a ordem de campos do XSD
- Arquivos enviados são armazenados em `fileBanks` no localStorage (convertidos para base64)

## Funcionalidades de desenvolvimento

- **Botão "Preencher dados de teste"**: visível apenas em modo dev (`npm run dev`), na página de Novo Contrato (`/contratos`). Preenche automaticamente todos os campos do formulário com dados mockados para facilitar testes.

## Alterações recentes

### Persistência de arquivos com base64

Anteriormente, os arquivos anexados via UploadBox eram perdidos ao recarregar a página, pois `File` objects nativos do browser não serializam corretamente com `JSON.stringify` (viram `{}`).

**Correção aplicada:**
- Arquivos são convertidos para base64 antes de salvar no localStorage
- Ao carregar, são reconstruídos como `File` objects a partir do base64
- Interfaces: `FileEntry` (memória) e `PersistedFileEntry` (localStorage)
- Helpers: `fileToBase64()` e `base64ToFile()` em `useDB.ts`
- Funções `addFileToBank` e `persistFileBanks` são agora `async`

### Footer com componente dedicado

- Footer extraído para `src/components/layout/AppFooter.vue`
- Importado e utilizado em `App.vue`

## Convenções

- Textos da interface e comentários em **pt-BR**
- Datas em formato `YYYY-MM-DD` internamente, exibidas como `DD/MM/YYYY` via `fmtDt()`
- Moeda: BRL (R$) com formatação `pt-BR`
- IDs de formulários seguem prefixos: `rc-*` (RolContratos), `fg-*` (FiscalGestor), `no-*` (Novas Obras), `ac-*` (Acomp. Contratos), `ao-*` (Acomp. Obras), `ef-*` (Exoneração), `sc-*` (Situação Contrato)
- Campos condicionais usam `v-show` vinculado a computed refs
- Campos obrigatórios marcados com `<span class="req">*</span>`

## Deploy

Arquivos estáticos em `dist/` deployados na Vercel. Executar `npm run build` antes.

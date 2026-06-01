# AGENTS.md

## Architecture

- **Vue 3 + TypeScript + Vite** SPA. Build step required.
- **Component-based**: every page, form, and shared element is a `.vue` SFC under `src/`.
- **State management**: Pinia store (`src/stores/useDB.ts`) with localStorage persistence.
- **Routing**: Vue Router 4 (`src/router/index.ts`).
- **Dependencies**: Chart.js, JSZip via npm (no CDN).

## Key structure

```
src/
├── main.ts                      # Entry point
├── App.vue                      # Root layout + router-view
├── router/index.ts              # Routes
├── stores/
│   ├── useDB.ts                 # DB store (all collections + file banks)
│   └── useToast.ts              # Toast notification store
├── types/index.ts               # TypeScript interfaces
├── utils/
│   ├── constants.ts             # Enums/labels
│   ├── format.ts                # fmtDt, fmtBRL, digits, uid, etc.
│   └── xml-builders/            # One file per XML (TCE-RO layout)
├── composables/useMasks.ts      # maskCNPJ, maskCPF, maskCEP
├── components/
│   ├── layout/                  # AppHeader, Sidebar, Footer, Overlay
│   ├── shared/                  # UploadBox, ToastMessage
│   └── export/ExportModal.vue   # ZIP generation
└── pages/                       # One page per route
```

## Data collections (Pinia store)

`useDB()` exposes: `rolContratos`, `fiscalGestor`, `rolObras`, `respTecnico`, `acompContratos`, `acompObras`, `exoneracaoFiscal`, `situacaoContrato`. Auto-persisted to localStorage.

## Running locally

```bash
npm install
npm run dev        # dev server at http://localhost:5173
npm run build      # production build to dist/
```

## Conventions

- All UI text, labels, and comments are in **Brazilian Portuguese (pt-BR)**.
- Date format: `YYYY-MM-DD` internally, displayed as `DD/MM/YYYY` via `fmtDt()`.
- Currency: BRL (R$) with `pt-BR` locale formatting.
- Form IDs follow prefix patterns: `rc-*` (RolContratos), `fg-*` (FiscalGestor), `no-*` (Novas Obras), `ac-*` (Acomp. Contratos), `ao-*` (Acomp. Obras), `ef-*` (Exoneração), `sc-*` (Situação Contrato).
- Conditional form fields use `v-show` bound to computed refs.
- Required fields marked with `<span class="req">*</span>`.

## XML Export

- `ExportModal.vue` generates ZIP with XML files conforming to TCE-RO v2026.0 layout.
- Each XML builder follows the XSD field order exactly.
- File uploads stored in `fileBanks` in localStorage.

## Deployment

Static files in `dist/` deployed to Vercel. Run `npm run build` first.

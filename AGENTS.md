# AGENTS.md

## Architecture

- **Pure static SPA** — all HTML, CSS, and JS in `index.html` + `styles/style.css`. No build step, no bundler, no framework.
- **All JavaScript is inline** inside `<script>` in `index.html`. There are no separate `.js` files.
- **Global state** — `DB` object holds all collections (`rolContratos`, `fiscalGestor`, `rolObras`, `respTecnico`, `acompContratos`, `acompObras`, `exoneracaoFiscal`, `situacaoContrato`). Data is ephemeral (lost on reload).
- **Page routing** — `showPage(id)` → `renderPage(id)` → calls page function (`pgNC`, `pgNO`, `pgAC`, `pgAO`, `pgEF`, `pgSC`, `pgHome`, `pgDash`).
- **CDN dependencies** — Chart.js and JSZip loaded via CDN in `<head>`. No local `node_modules`.

## Running locally

```bash
python3 -m http.server 8080
# or: npx serve .
# or: php -S localhost:8080
```

Then open `http://localhost:8080`. No install step needed.

## Conventions

- All UI text, labels, and comments are in **Brazilian Portuguese (pt-BR)**.
- Date format: `YYYY-MM-DD` internally, displayed as `DD/MM/YYYY` via `fmtDt()`.
- Currency: BRL (R$) with `pt-BR` locale formatting.
- Form IDs follow prefix patterns: `rc-*` (RolContratos), `fg-*` (FiscalGestor), `no-*` (Novas Obras), `ac-*` (Acomp. Contratos), `ao-*` (Acomp. Obras), `ef-*` (Exoneração), `sc-*` (Situação Contrato).
- Conditional form fields use `.cond-field` class toggled with `.show` via `onchange` handlers.
- Required fields marked with `<span class="req">*</span>` and validated via `markReq()`.

## Export (Fluxo H)

- Generates ZIP with XML files conforming to TCE-RO v2026.0 layout.
- Export modal is `#exp-modal`; generation triggered by `gerarRemessa()`.

## Deployment

Static files deployed to Vercel. No server-side code.

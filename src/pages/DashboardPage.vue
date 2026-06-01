<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useDB } from '../stores/useDB'
import { fmtDt, fmtBRL, pct } from '../utils/format'
import {
  tipoContrato, catContrato, tipoObra, tipoServ, sitObra, sitCor, tipoAlt,
} from '../utils/constants'

Chart.register(...registerables)

const db = useDB()

const chartMode = ref<'quantidade' | 'valores'>('quantidade')
const evoCanvas = ref<HTMLCanvasElement | null>(null)
const finCanvas = ref<HTMLCanvasElement | null>(null)

let evoChart: Chart | null = null
let finChart: Chart | null = null

function destroyCharts() {
  evoChart?.destroy()
  evoChart = null
  finChart?.destroy()
  finChart = null
}

function monthKey(d: string): string {
  if (!d) return ''
  return d.slice(0, 7)
}

function yearKey(d: string): string {
  if (!d) return ''
  return d.slice(0, 4)
}

function fmtMonth(key: string): string {
  const [y, m] = key.split('-')
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return `${months[parseInt(m) - 1]}/${y.slice(2)}`
}

function parseBRL(v: string | number): number {
  if (typeof v === 'number') return isNaN(v) ? 0 : v
  const n = parseFloat(v)
  return isNaN(n) ? 0 : n
}

const labels = computed(() => {
  const set = new Set<string>()
  for (const c of db.rolContratos) {
    const mk = monthKey(c.dataassinatura)
    if (mk) set.add(mk)
  }
  for (const o of db.rolObras) {
    const y = o.anoinstrumentocontratual
    if (y) set.add(y + '-01')
  }
  for (const a of db.acompContratos) {
    const mk = monthKey(a.dataassinaturaalteracao)
    if (mk) set.add(mk)
  }
  for (const o of db.acompObras) {
    const mk = monthKey(o.medicaodata)
    if (mk) set.add(mk)
  }
  return Array.from(set).sort()
})

const chartLabels = computed(() => labels.value.map(fmtMonth))

function buildCounts(source: string): number[] {
  return labels.value.map((lb) => {
    if (source === 'nc') {
      return db.rolContratos.filter((c) => monthKey(c.dataassinatura) === lb).length
    }
    if (source === 'no') {
      return db.rolObras.filter((o) => yearKey(o.anoinstrumentocontratual + '-01') === yearKey(lb)).length
    }
    if (source === 'ac') {
      return db.acompContratos.filter((a) => monthKey(a.dataassinaturaalteracao) === lb).length
    }
    if (source === 'ao') {
      return db.acompObras.filter((o) => monthKey(o.medicaodata) === lb).length
    }
    return 0
  })
}

function buildValues(source: string): number[] {
  return labels.value.map((lb) => {
    if (source === 'nc') {
      return db.rolContratos
        .filter((c) => monthKey(c.dataassinatura) === lb)
        .reduce((s, c) => s + parseBRL(c.valini), 0)
    }
    if (source === 'no') {
      return db.rolObras.filter((o) => yearKey(o.anoinstrumentocontratual + '-01') === yearKey(lb)).length
    }
    if (source === 'ac') {
      return db.acompContratos
        .filter((a) => monthKey(a.dataassinaturaalteracao) === lb)
        .reduce((s, a) => s + parseBRL(a.valacrescimo), 0)
    }
    if (source === 'ao') {
      return db.acompObras
        .filter((o) => monthKey(o.medicaodata) === lb)
        .reduce((s, o) => s + parseBRL(o.medicaoval), 0)
    }
    return 0
  })
}

const evoDatasets = computed(() => {
  const series = [
    { label: 'Novos Contratos', color: '#1565c0', source: 'nc' },
    { label: 'Novas Obras', color: '#2e7d32', source: 'no' },
    { label: 'Acomp. Contratos', color: '#f5a800', source: 'ac' },
    { label: 'Acomp. Obras', color: '#7c3aed', source: 'ao' },
  ]
  const data = chartMode.value === 'quantidade' ? buildCounts : buildValues
  return series.map((s) => ({
    label: s.label,
    backgroundColor: s.color,
    borderColor: s.color,
    data: data(s.source),
    borderWidth: 2,
    tension: 0.3,
    fill: false,
  }))
})

const finDatasets = computed(() => {
  const series = [
    { label: 'Valor Contratado', color: '#1565c0', source: 'nc' },
    { label: 'Total Medido', color: '#2e7d32', source: 'ao' },
    { label: 'Acréscimos', color: '#f5a800', source: 'ac' },
  ]
  const data = buildValues
  return series.map((s) => ({
    label: s.label,
    backgroundColor: s.color + '80',
    borderColor: s.color,
    data: data(s.source),
    borderWidth: 1,
  }))
})

const hasChartData = computed(() => labels.value.length > 0)

// --- KPI computed ---
const kpiContratos = computed(() => ({
  count: db.rolContratos.length,
  total: db.rolContratos.reduce((s, c) => s + parseBRL(c.valini), 0),
}))

const kpiObras = computed(() => ({
  count: db.rolObras.length,
  respCount: db.respTecnico.length,
}))

const kpiAcompContratos = computed(() => {
  const items = db.acompContratos
  const aditivos = items.filter((a) => a.tipoalteracao === '1').length
  const apostilamentos = items.filter((a) => a.tipoalteracao === '2').length
  const totalAcrescimos = items.reduce((s, a) => s + parseBRL(a.valacrescimo), 0)
  return { count: items.length, aditivos, apostilamentos, totalAcrescimos }
})

const kpiAcompObras = computed(() => ({
  count: db.acompObras.length,
  totalMedido: db.acompObras.reduce((s, o) => s + parseBRL(o.medicaoval), 0),
}))

function createEvoChart() {
  if (!evoCanvas.value) return
  const ctx = evoCanvas.value.getContext('2d')
  if (!ctx) return

  evoChart = new Chart(ctx, {
    type: chartMode.value === 'quantidade' ? 'bar' : 'line',
    data: {
      labels: chartLabels.value,
      datasets: evoDatasets.value,
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 12, padding: 12, font: { size: 11 } },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const raw = ctx.raw as number
              if (chartMode.value === 'valores') {
                return ` ${ctx.dataset.label}: ${fmtBRL(String(raw))}`
              }
              return ` ${ctx.dataset.label}: ${raw}`
            },
          },
        },
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          beginAtZero: true,
          grid: { color: '#f0f0f0' },
          ticks: {
            callback: (val) => {
              if (chartMode.value === 'valores') {
                const n = val as number
                if (n >= 1e6) return 'R$' + (n / 1e6).toFixed(1) + 'M'
                if (n >= 1e3) return 'R$' + (n / 1e3).toFixed(1) + 'K'
                return 'R$' + n
              }
              return val
            },
          },
        },
      },
    },
  })
}

function createFinChart() {
  if (!finCanvas.value) return
  const ctx = finCanvas.value.getContext('2d')
  if (!ctx) return

  finChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartLabels.value,
      datasets: finDatasets.value,
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 12, padding: 12, font: { size: 11 } },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const raw = ctx.raw as number
              return ` ${ctx.dataset.label}: ${fmtBRL(String(raw))}`
            },
          },
        },
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          beginAtZero: true,
          grid: { color: '#f0f0f0' },
          ticks: {
            callback: (val) => {
              const n = val as number
              if (n >= 1e6) return 'R$' + (n / 1e6).toFixed(1) + 'M'
              if (n >= 1e3) return 'R$' + (n / 1e3).toFixed(1) + 'K'
              return 'R$' + n
            },
          },
        },
      },
    },
  })
}

async function rebuildCharts() {
  destroyCharts()
  await nextTick()
  if (hasChartData.value) {
    createEvoChart()
    createFinChart()
  }
}

watch([chartMode, evoDatasets, finDatasets], rebuildCharts, { deep: true })

onMounted(rebuildCharts)
onUnmounted(destroyCharts)
</script>

<template>
  <div class="pt">Painel de Gestão</div>
  <div class="ps">Visão consolidada dos dados de contratos e obras</div>

  <!-- KPI Cards -->
  <div class="summary-grid">
    <div class="sc">
      <div class="sl2">Novos Contratos</div>
      <div class="sv">{{ kpiContratos.count }}</div>
      <div class="ss" v-if="kpiContratos.count">{{ fmtBRL(String(kpiContratos.total)) }}</div>
      <div class="ss" v-else>Total: —</div>
    </div>
    <div class="sc">
      <div class="sl2">Novas Obras</div>
      <div class="sv">{{ kpiObras.count }}</div>
      <div class="ss">{{ kpiObras.respCount }} resp. técnicos</div>
    </div>
    <div class="sc">
      <div class="sl2">Acomp. Contratos</div>
      <div class="sv">{{ kpiAcompContratos.count }}</div>
      <div class="ss" v-if="kpiAcompContratos.count">
        {{ kpiAcompContratos.aditivos }} aditivos · {{ kpiAcompContratos.apostilamentos }} apost.
        · {{ fmtBRL(String(kpiAcompContratos.totalAcrescimos)) }}
      </div>
      <div class="ss" v-else>Nenhum registro</div>
    </div>
    <div class="sc">
      <div class="sl2">Acomp. Obras</div>
      <div class="sv">{{ kpiAcompObras.count }}</div>
      <div class="ss" v-if="kpiAcompObras.count">Total medido: {{ fmtBRL(String(kpiAcompObras.totalMedido)) }}</div>
      <div class="ss" v-else>Nenhum registro</div>
    </div>
  </div>

  <!-- Evolution Chart -->
  <div class="card">
    <div class="ch">
      <h3>Evolução Mensal</h3>
      <div class="tabs chart-tabs">
        <span class="tab" :class="{ active: chartMode === 'quantidade' }" @click="chartMode = 'quantidade'">Quantidade</span>
        <span class="tab" :class="{ active: chartMode === 'valores' }" @click="chartMode = 'valores'">Valores</span>
      </div>
    </div>
    <div class="cb">
      <div v-if="hasChartData" class="chart-wrap">
        <canvas ref="evoCanvas"></canvas>
      </div>
      <div v-else class="empty">
        <div class="empty-icon">📊</div>
        <h4>Nenhum dado disponível</h4>
        <p>Cadastre contratos e obras para visualizar o gráfico de evolução</p>
      </div>
    </div>
  </div>

  <!-- Financial Comparison Chart -->
  <div class="card">
    <div class="ch">
      <h3>Comparativo Financeiro</h3>
    </div>
    <div class="cb">
      <div v-if="hasChartData" class="chart-wrap">
        <canvas ref="finCanvas"></canvas>
      </div>
      <div v-else class="empty">
        <div class="empty-icon">💰</div>
        <h4>Nenhum dado financeiro</h4>
        <p>Cadastre contratos e medições para visualizar o comparativo</p>
      </div>
    </div>
  </div>

  <!-- Novos Contratos Table -->
  <div class="card">
    <div class="ch"><h3>Novos Contratos</h3></div>
    <div class="cb tw" v-if="db.rolContratos.length">
      <table>
        <thead>
          <tr>
            <th>Nº Instrumento</th>
            <th>Ano</th>
            <th>Tipo</th>
            <th>Categoria</th>
            <th>Valor</th>
            <th>Vig. Início</th>
            <th>Vig. Fim</th>
            <th>Assinatura</th>
            <th>Rec/Desp</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in db.rolContratos" :key="c._id">
            <td>{{ c.numinstrumentocontratual }}</td>
            <td>{{ c.anoinstrumentocontratual }}</td>
            <td>{{ tipoContrato[c.tipo] || c.tipo }}</td>
            <td>{{ catContrato[c.categoria] || c.categoria }}</td>
            <td>{{ fmtBRL(c.valini) }}</td>
            <td>{{ fmtDt(c.dataviginicio) }}</td>
            <td>{{ fmtDt(c.datavigfim) }}</td>
            <td>{{ fmtDt(c.dataassinatura) }}</td>
            <td>{{ c.recdes || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="cb" v-else>
      <div class="empty">
        <div class="empty-icon">📄</div>
        <h4>Nenhum contrato cadastrado</h4>
        <p>Utilize o formulário de Novos Contratos para adicionar registros</p>
      </div>
    </div>
  </div>

  <!-- Fiscais e Gestores Table -->
  <div class="card">
    <div class="ch"><h3>Fiscais e Gestores</h3></div>
    <div class="cb tw" v-if="db.fiscalGestor.length">
      <table>
        <thead>
          <tr>
            <th>Contrato PNCP</th>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Designação</th>
            <th>Publicação</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="f in db.fiscalGestor" :key="f._id">
            <td>{{ f.idcontratopncp }}</td>
            <td>{{ f.nomeagente }}</td>
            <td>{{ f.tipoagente === '1' ? 'Fiscal' : f.tipoagente === '2' ? 'Gestor' : f.tipoagente }}</td>
            <td>{{ f.descricaodesignacao || '—' }}</td>
            <td>{{ f.urldesignacao ? '🔗' : '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="cb" v-else>
      <div class="empty">
        <div class="empty-icon">👤</div>
        <h4>Nenhum fiscal ou gestor cadastrado</h4>
        <p>Adicione fiscais e gestores aos contratos para visualizar</p>
      </div>
    </div>
  </div>

  <!-- Novas Obras Table -->
  <div class="card">
    <div class="ch"><h3>Novas Obras</h3></div>
    <div class="cb tw" v-if="db.rolObras.length">
      <table>
        <thead>
          <tr>
            <th>Instrumento</th>
            <th>Ano</th>
            <th>Nome do Bem</th>
            <th>Tipo</th>
            <th>Serviço</th>
            <th>Município</th>
            <th>Tamanho</th>
            <th>CEI</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in db.rolObras" :key="o._id">
            <td>{{ o.numinstrumentocontratual }}</td>
            <td>{{ o.anoinstrumentocontratual }}</td>
            <td>{{ o.bem }}</td>
            <td>{{ tipoObra[o.tipo] || o.tipo }}</td>
            <td>{{ tipoServ[o.tiposerv] || o.tiposerv }}</td>
            <td>{{ o.municipio }}</td>
            <td>{{ o.tamanho ? o.tamanho + (o.unidmedida || '') : '—' }}</td>
            <td>{{ o.cei || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="cb" v-else>
      <div class="empty">
        <div class="empty-icon">🏗</div>
        <h4>Nenhuma obra cadastrada</h4>
        <p>Utilize o formulário de Novas Obras para adicionar registros</p>
      </div>
    </div>
  </div>

  <!-- Acomp. Contratos Table -->
  <div class="card">
    <div class="ch"><h3>Acomp. Contratos</h3></div>
    <div class="cb tw" v-if="db.acompContratos.length">
      <table>
        <thead>
          <tr>
            <th>Contrato PNCP</th>
            <th>Nº Alteração</th>
            <th>Ano</th>
            <th>Seq.</th>
            <th>Tipo</th>
            <th>Assinatura</th>
            <th>Publicação</th>
            <th>Valor Acréscimo</th>
            <th>Arquivo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in db.acompContratos" :key="a._id">
            <td>{{ a.idcontratopncp }}</td>
            <td>{{ a.numeroalteracao }}</td>
            <td>{{ a.anoalteracao }}</td>
            <td>{{ a.sequencial }}</td>
            <td>{{ tipoAlt[a.tipoalteracao] || a.tipoalteracao }}</td>
            <td>{{ fmtDt(a.dataassinaturaalteracao) }}</td>
            <td>{{ fmtDt(a.datapubalteracao) }}</td>
            <td>{{ fmtBRL(a.valacrescimo) }}</td>
            <td>{{ a.arquivo ? '📎' : '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="cb" v-else>
      <div class="empty">
        <div class="empty-icon">📋</div>
        <h4>Nenhum acompanhamento de contrato</h4>
        <p>Adicione aditivos e apostilamentos nos contratos</p>
      </div>
    </div>
  </div>

  <!-- Acomp. Obras Table -->
  <div class="card">
    <div class="ch"><h3>Acomp. Obras</h3></div>
    <div class="cb tw" v-if="db.acompObras.length">
      <table>
        <thead>
          <tr>
            <th>Instrumento</th>
            <th>Ano</th>
            <th>Situação</th>
            <th>Medição Nº</th>
            <th>Data</th>
            <th>Valor</th>
            <th>% Medição</th>
            <th>% Acum.</th>
            <th>Val. Acumulado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in db.acompObras" :key="o._id">
            <td>{{ o.numinstrumentocontratual }}</td>
            <td>{{ o.anoinstrumentocontratual }}</td>
            <td>
              <span class="sit-badge" :style="{ background: sitCor[o.situacao] + '20', color: sitCor[o.situacao] }">
                {{ sitObra[o.situacao] || o.situacao }}
              </span>
            </td>
            <td>{{ o.medicaonum }}</td>
            <td>{{ fmtDt(o.medicaodata) }}</td>
            <td>{{ fmtBRL(o.medicaoval) }}</td>
            <td>{{ pct(o.medicaoperc) }}</td>
            <td>{{ pct(o.medicaopercac) }}</td>
            <td>{{ fmtBRL(o.medicaovalac) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="cb" v-else>
      <div class="empty">
        <div class="empty-icon">⚙</div>
        <h4>Nenhuma medição de obra registrada</h4>
        <p>Adicione acompanhamento de obras para visualizar</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pt {
  font-size: 18px;
  font-weight: 700;
  color: var(--text, #1a1f2e);
  margin-bottom: 2px;
  font-family: var(--font-head, 'Montserrat', system-ui, sans-serif);
}
.ps {
  font-size: 12px;
  color: var(--muted, #5a6478);
  margin-bottom: 1.25rem;
}
.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.85rem;
  margin-bottom: 1.25rem;
}
.sc {
  background: var(--card, #ffffff);
  border: 1px solid var(--border, #cdd6e8);
  border-radius: 8px;
  padding: 0.85rem 1rem;
}
.sl2 {
  font-size: 10px;
  font-weight: 600;
  color: var(--muted, #5a6478);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: var(--font-head, 'Montserrat', system-ui, sans-serif);
}
.sv {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary, #0a4a8f);
  margin-top: 3px;
  font-family: var(--font-head, 'Montserrat', system-ui, sans-serif);
}
.ss {
  font-size: 11px;
  color: var(--muted, #5a6478);
  margin-top: 1px;
}
.card {
  background: var(--card, #ffffff);
  border: 1px solid var(--border, #cdd6e8);
  border-radius: 8px;
  margin-bottom: 1.25rem;
  overflow: hidden;
}
.ch {
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid var(--border, #cdd6e8);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #002a68;
}
.ch h3 {
  font-size: 13px;
  font-weight: 600;
  color: #eef2f8;
  font-family: var(--font-head, 'Montserrat', system-ui, sans-serif);
  margin: 0;
}
.cb {
  padding: 1rem 1.25rem;
}
.chart-wrap {
  position: relative;
  width: 100%;
  max-height: 340px;
}
.chart-wrap canvas {
  width: 100% !important;
  max-height: 320px;
}
.chart-tabs {
  display: flex;
  gap: 4px;
}
.tab {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  font-family: var(--font-head, 'Montserrat', system-ui, sans-serif);
  transition: all 0.15s;
}
.tab:hover {
  border-color: rgba(255, 255, 255, 0.5);
  color: #fff;
}
.tab.active {
  background: #fff;
  color: #002a68;
  border-color: #fff;
}
.tw {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
th {
  padding: 7px 10px;
  text-align: left;
  font-size: 10px;
  font-weight: 600;
  color: var(--muted, #5a6478);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border, #cdd6e8);
  background: #fafafa;
  white-space: nowrap;
  font-family: var(--font-head, 'Montserrat', system-ui, sans-serif);
}
td {
  padding: 8px 10px;
  border-bottom: 1px solid #f5f5f5;
  color: var(--text, #1a1f2e);
}
tr:last-child td {
  border-bottom: none;
}
tr:hover td {
  background: #fafafa;
}
.empty {
  text-align: center;
  padding: 2rem 1rem;
  color: var(--muted, #5a6478);
}
.empty-icon {
  font-size: 36px;
  margin-bottom: 0.6rem;
}
.empty h4 {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 3px;
  font-family: var(--font-head, 'Montserrat', system-ui, sans-serif);
  color: var(--text, #1a1f2e);
}
.empty p {
  font-size: 12px;
  color: var(--muted, #5a6478);
}
.sit-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  font-family: var(--font-head, 'Montserrat', system-ui, sans-serif);
}
</style>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDB } from '../../stores/useDB'
import { useToast } from '../../stores/useToast'
import { rolContratos } from '../../utils/xml-builders/rolContratos'
import { fiscalGestor } from '../../utils/xml-builders/fiscalGestor'
import { rolObras } from '../../utils/xml-builders/rolObras'
import { acompContratos } from '../../utils/xml-builders/acompContratos'
import { acompObras } from '../../utils/xml-builders/acompObras'
import { exoneracaoFiscal } from '../../utils/xml-builders/exoneracaoFiscal'
import { situacaoContrato } from '../../utils/xml-builders/situacaoContrato'
import { respTecnico } from '../../utils/xml-builders/respTecnico'

const emit = defineEmits<{ close: [] }>()

const db = useDB()
const toast = useToast()

const mes = ref('01')
const ano = ref(new Date().getFullYear().toString())
const progressVisible = ref(false)
const progressPct = ref(0)
const progressMsg = ref('')
const xmlPreviewVisible = ref(false)
const xmlContent = ref('')

const now = new Date()
mes.value = String(now.getMonth() + 1).padStart(2, '0')

const fileDefs = [
  { key: 'rolContratos' as const, xml: 'RolContratos.xml' },
  { key: 'fiscalGestor' as const, xml: 'FiscalGestor.xml' },
  { key: 'acompContratos' as const, xml: 'AcompanhamentoContratos.xml' },
  { key: 'situacaoContrato' as const, xml: 'SituacaoContrato.xml' },
  { key: 'exoneracaoFiscal' as const, xml: 'ExoneracaoFiscal.xml' },
  { key: 'rolObras' as const, xml: 'RolObras.xml' },
  { key: 'respTecnico' as const, xml: 'RespTecnico.xml' },
  { key: 'acompObras' as const, xml: 'AcompanhamentoObras.xml' },
] as const

const bankDefs = [
  { label: 'Contratos.zip', bank: 'Contratos', desc: 'PDF dos contratos' },
  { label: 'AcompContratos.zip', bank: 'AcompContratos', desc: 'PDF dos aditivos/apostilamentos' },
  { label: 'RelatorioFot.zip', bank: 'RelatorioFot', desc: 'PDFs dos relatórios fotográficos' },
  { label: 'PlanObra.zip', bank: 'PlanObra', desc: 'Planilhas de obra' },
  { label: 'PlanLicitacao.zip', bank: 'PlanLicitacao', desc: 'Planilhas de licitação' },
  { label: 'PlanVencedora.zip', bank: 'PlanVencedora', desc: 'Planilhas da vencedora' },
  { label: 'ProjContratante.zip', bank: 'ProjContratante', desc: 'Projetos da contratante' },
  { label: 'ProjContratada.zip', bank: 'ProjContratada', desc: 'Projetos da contratada' },
]

const totalRegs = computed(() => {
  return Object.values(db).reduce((s: number, a: any) => {
    if (Array.isArray(a)) return s + a.length
    return s
  }, 0)
})

function hasData(key: string): boolean {
  const m: Record<string, any> = {
    rolContratos: db.rolContratos,
    fiscalGestor: db.fiscalGestor,
    acompContratos: db.acompContratos,
    situacaoContrato: db.situacaoContrato,
    exoneracaoFiscal: db.exoneracaoFiscal,
    rolObras: db.rolObras,
    respTecnico: db.respTecnico,
    acompObras: db.acompObras,
  }
  return m[key]?.length > 0
}

function countBank(bank: string): number {
  return db.fileBanks[bank]?.length || 0
}

function previewXML() {
  const builders = [rolContratos, fiscalGestor, acompContratos, situacaoContrato, exoneracaoFiscal, rolObras, acompObras, respTecnico]
  let xml = ''
  for (const fn of builders) {
    const r = fn(mes.value, ano.value)
    if (r) { xml = r; break }
  }
  if (!xml) xml = '<!-- Nenhum dado cadastrado -->'
  xmlPreviewVisible.value = true
  xmlContent.value = xml.substring(0, 5000) + (xml.length > 5000 ? '\n... (truncado)' : '')
}

async function gerarRemessa() {
  if (!totalRegs.value) {
    toast.show('Nenhum dado cadastrado para exportar.', 'err')
    return
  }

  progressVisible.value = true
  progressPct.value = 0
  progressMsg.value = 'Gerando arquivos...'

  try {
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()
    const prefix = `${ano.value}${mes.value}`
    let step = 0
    const totalSteps = 16

    const xmlFiles = [
      { name: 'RolContratos.xml', fn: rolContratos },
      { name: 'FiscalGestor.xml', fn: fiscalGestor },
      { name: 'AcompanhamentoContratos.xml', fn: acompContratos },
      { name: 'SituacaoContrato.xml', fn: situacaoContrato },
      { name: 'ExoneracaoFiscal.xml', fn: exoneracaoFiscal },
      { name: 'RolObras.xml', fn: rolObras },
      { name: 'AcompanhamentoObras.xml', fn: acompObras },
      { name: 'RespTecnico.xml', fn: respTecnico },
    ]

    for (const { name, fn } of xmlFiles) {
      step++
      progressPct.value = Math.round(step / totalSteps * 100)
      progressMsg.value = `Gerando ${name}...`
      await new Promise(r => setTimeout(r, 20))
      const content = fn(mes.value, ano.value)
      if (content) zip.file(name, content)
    }

    const zipDefs2 = [
      { zipName: 'Contratos.zip', bank: 'Contratos' },
      { zipName: 'AcompContratos.zip', bank: 'AcompContratos' },
      { zipName: 'RelatorioFot.zip', bank: 'RelatorioFot' },
      { zipName: 'PlanObra.zip', bank: 'PlanObra' },
      { zipName: 'PlanLicitacao.zip', bank: 'PlanLicitacao' },
      { zipName: 'PlanVencedora.zip', bank: 'PlanVencedora' },
      { zipName: 'ProjContratante.zip', bank: 'ProjContratante' },
      { zipName: 'ProjContratada.zip', bank: 'ProjContratada' },
    ]

    for (const { zipName, bank } of zipDefs2) {
      step++
      progressPct.value = Math.round(step / totalSteps * 100)
      progressMsg.value = `Empacotando ${zipName}...`
      await new Promise(r => setTimeout(r, 20))
      const entries = db.fileBanks[bank] || []
      if (entries.length > 0) {
        const inner = new JSZip()
        for (const entry of entries) {
          const buf = await entry.file.arrayBuffer()
          inner.file(entry.name, buf)
        }
        const innerBlob = await inner.generateAsync({ type: 'blob', compression: 'DEFLATE' })
        zip.file(zipName, innerBlob)
      }
    }

    progressPct.value = 95
    progressMsg.value = 'Comprimindo pacote final...'
    await new Promise(r => setTimeout(r, 50))

    const finalBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } })
    progressPct.value = 100
    progressMsg.value = 'Concluído!'

    const url = URL.createObjectURL(finalBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `TCERO_Remessa_${prefix}.zip`
    a.click()
    URL.revokeObjectURL(url)

    toast.show(`Remessa gerada: TCERO_Remessa_${prefix}.zip`)
    setTimeout(() => emit('close'), 1500)
  } catch (err: any) {
    toast.show('Erro ao gerar remessa: ' + err.message, 'err')
    console.error(err)
  }
}
</script>

<template>
  <div class="mo" @click.self="emit('close')">
    <div class="md">
      <div class="mh">
        <h3>Exportar Remessa Mensal — TCE-RO</h3>
        <button class="mclose" @click="emit('close')">×</button>
      </div>
      <div class="mb">
        <div class="fg" style="margin-bottom:1rem">
          <div class="fgi">
            <label>Mês de Referência</label>
            <select v-model="mes">
              <option v-for="i in 12" :key="i" :value="String(i).padStart(2,'0')">
                {{ ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'][i-1] }}
              </option>
            </select>
          </div>
          <div class="fgi">
            <label>Ano</label>
            <input type="number" v-model="ano" min="2020" max="2099">
          </div>
        </div>

        <div class="file-list-bg">
          <div class="file-list-title">Arquivos que serão gerados</div>
          <div class="file-list-grid">
            <div v-for="d in fileDefs" :key="d.key" class="file-item" :class="{ ok: hasData(d.key) }">
              <span class="file-icon">{{ hasData(d.key) ? '✅' : '⬜' }}</span>
              <div>
                <div class="file-name">{{ d.xml }}</div>
                <div class="file-count">{{ db[d.key].length }} registro(s)</div>
              </div>
            </div>
            <div v-for="z in bankDefs" :key="z.bank" class="file-item" :class="{ has: countBank(z.bank) > 0 }">
              <span class="file-icon">{{ countBank(z.bank) > 0 ? '📦' : '📭' }}</span>
              <div>
                <div class="file-name">{{ z.label }} <span class="file-count">({{ countBank(z.bank) }} arq.)</span></div>
                <div class="file-count">{{ z.desc }}</div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="progressVisible" class="progress-bar">
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: progressPct + '%' }"></div>
          </div>
          <div class="progress-msg">{{ progressMsg }}</div>
        </div>

        <div v-if="xmlPreviewVisible" class="xml-preview">
          <pre>{{ xmlContent }}</pre>
        </div>
      </div>
      <div class="mf">
        <button class="btn btn-s" @click="emit('close')">Cancelar</button>
        <button class="btn btn-s" @click="previewXML">👁 Pré-visualizar XML</button>
        <button class="btn btn-p" @click="gerarRemessa">📦 Gerar Remessa Completa</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mo {
  position: fixed; inset: 0; background: rgba(10,15,30,.55); z-index: 200;
  display: flex; align-items: center; justify-content: center; padding: 1rem;
}
.md {
  background: #fff; border-radius: 10px; width: 100%; max-width: 640px;
  max-height: 88vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,.15);
}
.mh {
  padding: 1rem 1.25rem; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; background: #fff; z-index: 1;
}
.mh h3 { font-size: 15px; font-weight: 700; color: var(--text); }
.mclose { background: none; border: none; cursor: pointer; font-size: 22px; color: var(--muted); }
.mb { padding: 1.25rem; }
.mf { padding: .85rem 1.25rem; border-top: 1px solid var(--border); display: flex; gap: 8px; justify-content: flex-end; }
.file-list-bg {
  background: #f8faff; border: 1px solid var(--border); border-radius: 9px;
  padding: 1rem; margin-bottom: 1rem;
}
.file-list-title {
  font-size: 11px; font-weight: 700; color: var(--primary);
  text-transform: uppercase; letter-spacing: .5px; margin-bottom: .75rem;
}
.file-list-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 12px; }
.file-item {
  display: flex; align-items: center; gap: 6px; padding: 4px 8px;
  border-radius: 6px; background: #f8faff; border: 1px solid #e0e7ff;
}
.file-item.ok { background: #f0fdf4; border-color: #bbf7d0; }
.file-item.has { background: #fff7ed; border-color: #fed7aa; }
.file-icon { font-size: 14px; }
.file-name { font-size: 11px; font-weight: 700; color: var(--text); }
.file-count { font-size: 10px; color: var(--muted); }
.progress-bar { margin-bottom: .75rem; }
.progress-track { height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--primary-light); border-radius: 3px; transition: width .3s; }
.progress-msg { font-size: 11px; color: var(--muted); margin-top: 4px; }
.xml-preview {
  background: #1a1f2e; color: #7dd3fc; font-family: 'Courier New', monospace;
  font-size: 11px; padding: 1rem; border-radius: 6px; max-height: 280px;
  overflow: auto; line-height: 1.6; margin-top: 1rem;
}
</style>

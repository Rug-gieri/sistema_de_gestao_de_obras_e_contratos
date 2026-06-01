<script setup lang="ts">
import { ref } from 'vue'
import { useDB } from '../stores/useDB'
import { useToast } from '../stores/useToast'
import { maskCNPJ } from '../composables/useMasks'
import { uid, fmtBRL } from '../utils/format'
import UploadBox from '../components/shared/UploadBox.vue'

const db = useDB()
const toast = useToast()

const aoCnpj = ref('')
const aoIdContratoPNCP = ref('')
const aoNumInstrumentoContratual = ref('')
const aoAnoInstrumentoContratual = ref('')
const aoProcesso = ref('')
const aoAnoProc = ref('')
const aoSituacao = ref('')
const aoMedicaoNum = ref('')
const aoMedicaoData = ref('')
const aoMedicaoVal = ref('')
const aoMedicaoPerc = ref('')
const aoMedicaoValAc = ref('')
const aoMedicaoPercAc = ref('')

const aoRelfotRef = ref<InstanceType<typeof UploadBox> | null>(null)
const aoPlanobraRef = ref<InstanceType<typeof UploadBox> | null>(null)

const invalids = ref(new Set<string>())

function setInv(field: string, invalid: boolean) {
  if (invalid) invalids.value.add(field)
  else invalids.value.delete(field)
}

function isInv(field: string): boolean {
  return invalids.value.has(field)
}

function getRef(field: string) {
  const map: Record<string, any> = {
    'ao-cnpj': aoCnpj, 'ao-idcontratopncp': aoIdContratoPNCP,
    'ao-numinstrumentocontratual': aoNumInstrumentoContratual,
    'ao-anoinstrumentocontratual': aoAnoInstrumentoContratual,
    'ao-processo': aoProcesso, 'ao-anoproc': aoAnoProc,
    'ao-situacao': aoSituacao, 'ao-medicaonum': aoMedicaoNum,
    'ao-medicaodata': aoMedicaoData, 'ao-medicaoval': aoMedicaoVal,
    'ao-medicaoperc': aoMedicaoPerc, 'ao-medicaovalac': aoMedicaoValAc,
    'ao-medicaopercac': aoMedicaoPercAc,
  }
  return map['ao-' + field]
}

function valid(fields: string[]): boolean {
  let ok = true
  for (const f of fields) {
    const ref = getRef(f)
    if (!ref || !ref.value.trim()) {
      setInv(f, true)
      ok = false
    } else {
      setInv(f, false)
    }
  }
  return ok
}

function onCnpjInput() {
  aoCnpj.value = maskCNPJ(aoCnpj.value)
}

function resetAll() {
  aoCnpj.value = ''
  aoIdContratoPNCP.value = ''
  aoNumInstrumentoContratual.value = ''
  aoAnoInstrumentoContratual.value = ''
  aoProcesso.value = ''
  aoAnoProc.value = ''
  aoSituacao.value = ''
  aoMedicaoNum.value = ''
  aoMedicaoData.value = ''
  aoMedicaoVal.value = ''
  aoMedicaoPerc.value = ''
  aoMedicaoValAc.value = ''
  aoMedicaoPercAc.value = ''
  invalids.value = new Set()
  aoRelfotRef.value?.reset()
  aoPlanobraRef.value?.reset()
}

function saveAO() {
  invalids.value = new Set()

  const req = ['cnpj', 'idcontratopncp', 'numinstrumentocontratual',
    'anoinstrumentocontratual', 'situacao', 'medicaonum', 'medicaoval',
    'medicaoperc', 'medicaodata', 'medicaovalac', 'medicaopercac',
    'processo', 'anoproc']
  let ok = valid(req)

  const up1 = aoRelfotRef.value?.validate() ?? false
  const up2 = aoPlanobraRef.value?.validate() ?? false
  if (!up1 || !up2) ok = false

  if (!ok) {
    toast.show('Preencha os campos obrigatórios e importe o relatório fotográfico e a planilha.', 'err')
    return
  }

  const vals: Record<string, string> = { _id: uid() }
  const allFields = [...req, 'relfot', 'planobra']
  for (const f of allFields) {
    const ref = getRef(f)
    vals[f] = ref ? ref.value.trim() : ''
  }

  db.acompObras.push(vals as any)
  db.persist()
  toast.show('Acompanhamento de obra salvo!', 'ok')
  resetAll()
}

function confirmDel(col: string, id: string) {
  if (!confirm(`Excluir este acompanhamento?`)) return
  db.delRec(col, id)
  toast.show('Registro excluído.', 'err')
}

const sitLabel: Record<string, string> = {
  '01': 'Não Iniciada', '02': 'Em Andamento', '03': 'Paralisada',
  '04': 'Concluída', '05': 'Cancelada'
}
</script>

<template>
  <div class="pt">Registre uma medição</div>
  <div class="ps">Medições e progresso físico-financeiro</div>

  <div class="card">
    <div class="ch"><h3>Medição</h3></div>
    <div class="cb">
      <div class="section-title">Identificação</div>
      <div class="fg c3">
        <div class="fgi">
          <label>CNPJ da UG <span class="req">*</span></label>
          <input type="text" id="ao-cnpj" v-model="aoCnpj" maxlength="18"
            placeholder="00.000.000/0000-00" @input="onCnpjInput"
            :class="{ inv: isInv('cnpj') }">
        </div>
        <div class="fgi">
          <label>ID Contrato PNCP <span class="req">*</span><span class="maxlen">28 car.</span></label>
          <input type="text" id="ao-idcontratopncp" v-model="aoIdContratoPNCP" maxlength="28"
            placeholder="ID do contrato da obra" :class="{ inv: isInv('idcontratopncp') }">
        </div>
        <div class="fgi">
          <label>Nº do Instrumento Contratual <span class="req">*</span><span class="maxlen">20 car.</span></label>
          <input type="text" id="ao-numinstrumentocontratual" v-model="aoNumInstrumentoContratual" maxlength="20"
            placeholder="Número do contrato" :class="{ inv: isInv('numinstrumentocontratual') }">
        </div>
        <div class="fgi">
          <label>Ano do Instrumento <span class="req">*</span></label>
          <input type="number" id="ao-anoinstrumentocontratual" v-model="aoAnoInstrumentoContratual"
            min="2000" max="2099" placeholder="aaaa"
            :class="{ inv: isInv('anoinstrumentocontratual') }">
        </div>
        <div class="fgi">
          <label>Nº do Processo Adm. <span class="req">*</span><span class="maxlen">16 car.</span></label>
          <input type="text" id="ao-processo" v-model="aoProcesso" maxlength="16"
            placeholder="Número do processo" :class="{ inv: isInv('processo') }">
        </div>
        <div class="fgi">
          <label>Ano do Processo <span class="req">*</span></label>
          <input type="number" id="ao-anoproc" v-model="aoAnoProc" min="2000" max="2099" placeholder="aaaa"
            :class="{ inv: isInv('anoproc') }">
        </div>
      </div>

      <div class="section-title">Situação e Medição</div>
      <div class="fg c3">
        <div class="fgi">
          <label>Situação da Obra <span class="req">*</span></label>
          <select id="ao-situacao" v-model="aoSituacao" :class="{ inv: isInv('situacao') }">
            <option value="">Selecione...</option>
            <option value="01">01 - Não Iniciada</option>
            <option value="02">02 - Em Andamento</option>
            <option value="03">03 - Paralisada</option>
            <option value="04">04 - Concluída</option>
            <option value="05">05 - Cancelada</option>
          </select>
        </div>
        <div class="fgi">
          <label>Nº da Medição <span class="req">*</span><span class="maxlen">16 car.</span></label>
          <input type="text" id="ao-medicaonum" v-model="aoMedicaoNum" maxlength="16"
            placeholder="Ex: 001" :class="{ inv: isInv('medicaonum') }">
        </div>
        <div class="fgi">
          <label>Data da Medição <span class="req">*</span></label>
          <input type="date" id="ao-medicaodata" v-model="aoMedicaoData"
            :class="{ inv: isInv('medicaodata') }">
        </div>
        <div class="fgi">
          <label>Valor da Medição R$ <span class="req">*</span></label>
          <input type="number" id="ao-medicaoval" v-model="aoMedicaoVal" min="0" step="0.01" placeholder="0,00"
            :class="{ inv: isInv('medicaoval') }">
        </div>
        <div class="fgi">
          <label>% da Medição <span class="req">*</span><span class="hint">Ex: 5.50 para 5,50%</span></label>
          <input type="number" id="ao-medicaoperc" v-model="aoMedicaoPerc" min="0" max="100" step="0.01"
            placeholder="Ex: 5.50" :class="{ inv: isInv('medicaoperc') }">
        </div>
        <div class="fgi">
          <label>Valor Acumulado R$ <span class="req">*</span></label>
          <input type="number" id="ao-medicaovalac" v-model="aoMedicaoValAc" min="0" step="0.01" placeholder="0,00"
            :class="{ inv: isInv('medicaovalac') }">
        </div>
        <div class="fgi">
          <label>% Acumulado <span class="req">*</span><span class="hint">Total até esta medição</span></label>
          <input type="number" id="ao-medicaopercac" v-model="aoMedicaoPercAc" min="0" max="100" step="0.01"
            placeholder="Ex: 35.50" :class="{ inv: isInv('medicaopercac') }">
        </div>
      </div>

      <div class="section-title">Arquivos da Medição</div>
      <div class="fg c3">
        <UploadBox ref="aoRelfotRef" prefix="ao-relfot" label="Relatório Fotográfico (PDF)"
          hint="máx. 20 car." file-icon="📸" />
        <UploadBox ref="aoPlanobraRef" prefix="ao-planobra" label="Planilha da Obra"
          hint="máx. 20 car." file-icon="📊" />
      </div>

      <div class="acts">
        <button class="btn btn-p" @click="saveAO">Salvar Acompanhamento</button>
        <button class="btn btn-s" @click="resetAll">Limpar</button>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="ch">
      <h3>Acompanhamentos de Obras</h3>
      <span class="tag">{{ db.acompObras.length }} registros</span>
    </div>
    <div class="cb">
      <div class="tw" v-if="db.acompObras.length">
        <table>
          <thead>
            <tr>
              <th>Instrumento</th>
              <th>Ano</th>
              <th>Situação</th>
              <th>Medição Nº</th>
              <th>Valor Medição</th>
              <th>% Acum.</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in db.acompObras" :key="r._id">
              <td><strong>{{ r.numinstrumentocontratual || '-' }}</strong></td>
              <td>{{ r.anoinstrumentocontratual || '-' }}</td>
              <td>{{ sitLabel[r.situacao] || r.situacao || '-' }}</td>
              <td>{{ r.medicaonum || '-' }}</td>
              <td>{{ fmtBRL(r.medicaoval) }}</td>
              <td>{{ r.medicaopercac || '0' }}%</td>
              <td><button class="btn btn-d btn-sm" @click="confirmDel('acompObras', r._id)">Excluir</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="empty" v-else>
        <div class="empty-icon">⚙</div>
        <h4>Nenhum acompanhamento</h4>
        <p>Adicione medições acima</p>
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
.ch .tag {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  background: #f3f4f6;
  color: var(--muted, #5a6478);
  font-family: var(--font-head, 'Montserrat', system-ui, sans-serif);
}
.cb {
  padding: 1rem 1.25rem;
}
.fg {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
}
.fg.c3 {
  grid-template-columns: 1fr 1fr 1fr;
}
.fg.c1 {
  grid-template-columns: 1fr;
}
.fgi {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.fgi.s2 {
  grid-column: span 2;
}
.fgi.s3 {
  grid-column: span 3;
}
label {
  font-size: 11px;
  font-weight: 600;
  color: var(--label, #374151);
  display: flex;
  align-items: center;
  gap: 3px;
}
label .req {
  color: var(--danger, #c62828);
  font-size: 13px;
  line-height: 1;
}
label .maxlen {
  font-weight: 400;
  color: var(--muted, #5a6478);
  font-size: 10px;
  margin-left: auto;
}
label .hint {
  font-weight: 400;
  color: var(--muted, #5a6478);
  font-size: 10px;
  margin-left: 4px;
}
input[type="text"],
input[type="date"],
input[type="number"],
input[type="url"],
select,
textarea {
  width: 100%;
  padding: 7px 9px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 12.5px;
  color: var(--text, #1a1f2e);
  background: var(--input-bg, #ffffff);
  font-family: var(--font, 'Open Sans', system-ui, sans-serif);
  transition: border 0.12s, box-shadow 0.12s;
  outline: none;
}
input:focus,
select:focus,
textarea:focus {
  border-color: var(--primary, #0a4a8f);
  box-shadow: 0 0 0 3px rgba(10, 74, 143, 0.08);
}
input.inv,
select.inv,
textarea.inv {
  border-color: var(--danger, #c62828) !important;
  box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.1);
}
textarea {
  resize: vertical;
  min-height: 65px;
}
select {
  cursor: pointer;
}
.section-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--muted, #5a6478);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 1rem 0 0.5rem;
  padding-bottom: 4px;
  border-bottom: 1px solid #e5e7eb;
  font-family: var(--font-head, 'Montserrat', system-ui, sans-serif);
}
.acts {
  display: flex;
  gap: 8px;
  margin-top: 1rem;
}
.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}
.btn-p {
  background: var(--primary, #0a4a8f);
  color: #fff;
  font-family: var(--font-head, 'Montserrat', system-ui, sans-serif);
}
.btn-p:hover {
  background: var(--primary-light, #1565c0);
}
.btn-s {
  background: #fff;
  color: var(--text, #1a1f2e);
  border: 1px solid var(--border, #cdd6e8);
  font-family: var(--font-head, 'Montserrat', system-ui, sans-serif);
}
.btn-s:hover {
  border-color: var(--primary, #0a4a8f);
  color: var(--primary, #0a4a8f);
}
.btn-d {
  background: #fef2f2;
  color: var(--danger, #c62828);
}
.btn-sm {
  padding: 5px 10px;
  font-size: 11px;
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
.cond-field {
  display: none;
}
.cond-field.show {
  display: block;
}
</style>

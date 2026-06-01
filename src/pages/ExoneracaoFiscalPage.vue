<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDB } from '../stores/useDB'
import { useToast } from '../stores/useToast'
import { maskCNPJ, maskCPF } from '../composables/useMasks'
import { uid } from '../utils/format'

const db = useDB()
const toast = useToast()

const efCnpj = ref('')
const efIdContratoPNCP = ref('')
const efIdentificadorAgente = ref('')
const efCpfAgente = ref('')
const efCnpjAgente = ref('')
const efDataExoneracao = ref('')
const efExoneracao = ref('')
const efNumeroExoneracao = ref('')
const efAnoExoneracao = ref('')
const efDescricaoExoneracao = ref('')
const efDataPubliExoneracao = ref('')
const efLocalExoneracao = ref('')
const efUrlExoneracao = ref('')

const showCpfAgente = computed(() => efIdentificadorAgente.value === '1')
const showCnpjAgente = computed(() => efIdentificadorAgente.value === '2')
const showDescricaoExoneracao = computed(() => efExoneracao.value === '6')

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
    'ef-cnpj': efCnpj, 'ef-idcontratopncp': efIdContratoPNCP,
    'ef-identificadoragente': efIdentificadorAgente, 'ef-cpfagente': efCpfAgente,
    'ef-cnpjagente': efCnpjAgente, 'ef-dataexoneracao': efDataExoneracao,
    'ef-exoneracao': efExoneracao, 'ef-numeroexoneracao': efNumeroExoneracao,
    'ef-anoexoneracao': efAnoExoneracao, 'ef-descricaoexoneracao': efDescricaoExoneracao,
    'ef-datapubliexoneracao': efDataPubliExoneracao, 'ef-localexoneracao': efLocalExoneracao,
    'ef-urlexoneracao': efUrlExoneracao,
  }
  return map['ef-' + field]
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
  efCnpj.value = maskCNPJ(efCnpj.value)
}

function onCpfInput() {
  efCpfAgente.value = maskCPF(efCpfAgente.value)
}

function onCnpjAgenteInput() {
  efCnpjAgente.value = maskCNPJ(efCnpjAgente.value)
}

function resetAll() {
  efCnpj.value = ''
  efIdContratoPNCP.value = ''
  efIdentificadorAgente.value = ''
  efCpfAgente.value = ''
  efCnpjAgente.value = ''
  efDataExoneracao.value = ''
  efExoneracao.value = ''
  efNumeroExoneracao.value = ''
  efAnoExoneracao.value = ''
  efDescricaoExoneracao.value = ''
  efDataPubliExoneracao.value = ''
  efLocalExoneracao.value = ''
  efUrlExoneracao.value = ''
  invalids.value = new Set()
}

function saveEF() {
  invalids.value = new Set()

  const req = ['cnpj', 'idcontratopncp', 'identificadoragente', 'dataexoneracao',
    'exoneracao', 'numeroexoneracao', 'anoexoneracao', 'datapubliexoneracao',
    'localexoneracao', 'urlexoneracao']
  let ok = valid(req)

  if (efIdentificadorAgente.value === '1' && !efCpfAgente.value.trim()) {
    setInv('cpfagente', true); ok = false
  }
  if (efIdentificadorAgente.value === '2' && !efCnpjAgente.value.trim()) {
    setInv('cnpjagente', true); ok = false
  }

  if (!ok) {
    toast.show('Preencha os campos obrigatórios.', 'err')
    return
  }

  const vals: Record<string, string> = { _id: uid() }
  const allFields = [...req, 'cpfagente', 'cnpjagente', 'descricaoexoneracao']
  for (const f of allFields) {
    const ref = getRef(f)
    vals[f] = ref ? ref.value.trim() : ''
  }

  db.exoneracaoFiscal.push(vals as any)
  db.persist()
  toast.show('Exoneração salva!', 'ok')
  resetAll()
}

function confirmDel(col: string, id: string) {
  if (!confirm(`Excluir esta exoneração?`)) return
  db.delRec(col, id)
  toast.show('Registro excluído.', 'err')
}

const atoLabel: Record<string, string> = {
  '1': 'Decreto', '2': 'Portaria', '3': 'Ofício',
  '4': 'Termo nos autos', '5': 'Contrato', '6': 'Outro'
}
</script>

<template>
  <div class="pt">Exoneração de Fiscal/Gestor</div>
  <div class="ps">Encerramento de designação de agentes</div>

  <div class="card">
    <div class="ch"><h3>Encerrar Designação</h3></div>
    <div class="cb">
      <div class="section-title">Identificação do Contrato</div>
      <div class="fg c3">
        <div class="fgi">
          <label>CNPJ da UG <span class="req">*</span></label>
          <input type="text" id="ef-cnpj" v-model="efCnpj" maxlength="18"
            placeholder="00.000.000/0000-00" @input="onCnpjInput"
            :class="{ inv: isInv('cnpj') }">
        </div>
        <div class="fgi s2">
          <label>ID Contrato PNCP <span class="req">*</span><span class="maxlen">28 car.</span></label>
          <input type="text" id="ef-idcontratopncp" v-model="efIdContratoPNCP" maxlength="28"
            placeholder="ID do contrato" :class="{ inv: isInv('idcontratopncp') }">
        </div>
      </div>

      <div class="section-title">Identificação do Agente</div>
      <div class="fg c3">
        <div class="fgi">
          <label>Forma de Identificação <span class="req">*</span></label>
          <select id="ef-identificadoragente" v-model="efIdentificadorAgente"
            :class="{ inv: isInv('identificadoragente') }">
            <option value="">Selecione...</option>
            <option value="1">1 - CPF</option>
            <option value="2">2 - CNPJ</option>
          </select>
        </div>
        <div class="fgi cond-field" v-show="showCpfAgente">
          <label>CPF do Agente <span class="req">*</span><span class="maxlen">11 car.</span></label>
          <input type="text" id="ef-cpfagente" v-model="efCpfAgente" maxlength="14"
            placeholder="000.000.000-00" @input="onCpfInput"
            :class="{ inv: isInv('cpfagente') }">
        </div>
        <div class="fgi cond-field" v-show="showCnpjAgente">
          <label>CNPJ do Agente <span class="req">*</span><span class="maxlen">14 car.</span></label>
          <input type="text" id="ef-cnpjagente" v-model="efCnpjAgente" maxlength="18"
            placeholder="00.000.000/0000-00" @input="onCnpjAgenteInput"
            :class="{ inv: isInv('cnpjagente') }">
        </div>
        <div class="fgi">
          <label>Data dos Efeitos da Exoneração <span class="req">*</span></label>
          <input type="date" id="ef-dataexoneracao" v-model="efDataExoneracao"
            :class="{ inv: isInv('dataexoneracao') }">
        </div>
      </div>

      <div class="section-title">Ato de Exoneração</div>
      <div class="fg c3">
        <div class="fgi">
          <label>Tipo do Ato <span class="req">*</span></label>
          <select id="ef-exoneracao" v-model="efExoneracao"
            :class="{ inv: isInv('exoneracao') }">
            <option value="">Selecione...</option>
            <option value="1">1 - Decreto</option>
            <option value="2">2 - Portaria</option>
            <option value="3">3 - Ofício</option>
            <option value="4">4 - Termo nos autos</option>
            <option value="5">5 - Contrato</option>
            <option value="6">6 - Outro</option>
          </select>
        </div>
        <div class="fgi">
          <label>Nº do Ato de Exoneração <span class="req">*</span><span class="maxlen">16 car.</span></label>
          <input type="text" id="ef-numeroexoneracao" v-model="efNumeroExoneracao" maxlength="16"
            placeholder="Número do ato" :class="{ inv: isInv('numeroexoneracao') }">
        </div>
        <div class="fgi">
          <label>Ano do Ato <span class="req">*</span></label>
          <input type="number" id="ef-anoexoneracao" v-model="efAnoExoneracao"
            min="2000" max="2099" placeholder="aaaa"
            :class="{ inv: isInv('anoexoneracao') }">
        </div>
        <div class="fgi s3 cond-field" v-show="showDescricaoExoneracao">
          <label>Descrição da Exoneração <span class="req">*</span><span class="maxlen">250 car.</span></label>
          <input type="text" id="ef-descricaoexoneracao" v-model="efDescricaoExoneracao" maxlength="250"
            placeholder="Descreva o tipo de exoneração"
            :class="{ inv: isInv('descricaoexoneracao') }">
        </div>
        <div class="fgi">
          <label>Data de Publicação do Ato <span class="req">*</span></label>
          <input type="date" id="ef-datapubliexoneracao" v-model="efDataPubliExoneracao"
            :class="{ inv: isInv('datapubliexoneracao') }">
        </div>
        <div class="fgi">
          <label>Local de Publicação <span class="req">*</span></label>
          <select id="ef-localexoneracao" v-model="efLocalExoneracao"
            :class="{ inv: isInv('localexoneracao') }">
            <option value="">Selecione...</option>
            <option value="1">1 - Diário Oficial</option>
            <option value="2">2 - Jornal de circulação</option>
            <option value="3">3 - Sítio eletrônico oficial</option>
            <option value="4">4 - Portal de Transparência</option>
            <option value="5">5 - Afixação em ambiente público</option>
            <option value="6">6 - PNCP</option>
            <option value="7">7 - Outro</option>
          </select>
        </div>
        <div class="fgi s3">
          <label>URL de Publicação <span class="req">*</span><span class="maxlen">1024 car.</span></label>
          <input type="url" id="ef-urlexoneracao" v-model="efUrlExoneracao" maxlength="1024"
            placeholder="https://" :class="{ inv: isInv('urlexoneracao') }">
        </div>
      </div>

      <div class="acts">
        <button class="btn btn-p" @click="saveEF">Salvar Exoneração</button>
        <button class="btn btn-s" @click="resetAll">Limpar</button>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="ch">
      <h3>Exonerações Registradas</h3>
      <span class="tag">{{ db.exoneracaoFiscal.length }} registros</span>
    </div>
    <div class="cb">
      <div class="tw" v-if="db.exoneracaoFiscal.length">
        <table>
          <thead>
            <tr>
              <th>ID PNCP</th>
              <th>Agente</th>
              <th>Ident.</th>
              <th>Data Exoneração</th>
              <th>Ato</th>
              <th>Nº Ato</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in db.exoneracaoFiscal" :key="r._id">
              <td>{{ r.idcontratopncp || '-' }}</td>
              <td>{{ r.cpfagente || r.cnpjagente || '-' }}</td>
              <td>{{ r.identificadoragente === '1' ? 'CPF' : 'CNPJ' }}</td>
              <td>{{ r.dataexoneracao || '-' }}</td>
              <td>{{ atoLabel[r.exoneracao] || '-' }}</td>
              <td>{{ r.numeroexoneracao || '-' }}</td>
              <td><button class="btn btn-d btn-sm" @click="confirmDel('exoneracaoFiscal', r._id)">Excluir</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="empty" v-else>
        <div class="empty-icon">🔄</div>
        <h4>Nenhuma exoneração</h4>
        <p>Adicione registros acima</p>
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

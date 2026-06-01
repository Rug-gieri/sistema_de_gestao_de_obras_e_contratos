<script setup lang="ts">
import { ref } from 'vue'
import { useDB } from '../stores/useDB'
import { useToast } from '../stores/useToast'
import { maskCNPJ } from '../composables/useMasks'
import { uid } from '../utils/format'

const db = useDB()
const toast = useToast()

const scCnpj = ref('')
const scIdContratoPNCP = ref('')
const scCodigoSituacao = ref('')
const scJustificativa = ref('')

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
    'sc-cnpj': scCnpj, 'sc-idcontratopncp': scIdContratoPNCP,
    'sc-codigosituacaoinstrumentocontratacao': scCodigoSituacao,
    'sc-justificativasituacao': scJustificativa,
  }
  return map['sc-' + field]
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
  scCnpj.value = maskCNPJ(scCnpj.value)
}

function resetAll() {
  scCnpj.value = ''
  scIdContratoPNCP.value = ''
  scCodigoSituacao.value = ''
  scJustificativa.value = ''
  invalids.value = new Set()
}

function saveSC() {
  invalids.value = new Set()

  const req = ['cnpj', 'idcontratopncp', 'codigosituacaoinstrumentocontratacao']
  if (!valid(req)) {
    toast.show('Preencha os campos obrigatórios.', 'err')
    return
  }

  const vals: Record<string, string> = { _id: uid() }
  const allFields = [...req, 'justificativasituacao']
  for (const f of allFields) {
    const ref = getRef(f)
    vals[f] = ref ? ref.value.trim() : ''
  }

  db.situacaoContrato.push(vals as any)
  db.persist()
  toast.show('Situação salva!', 'ok')
  resetAll()
}

function confirmDel(col: string, id: string) {
  if (!confirm(`Excluir esta situação?`)) return
  db.delRec(col, id)
  toast.show('Registro excluído.', 'err')
}

const sitLabel: Record<string, string> = {
  '01': 'Publicado', '02': 'Revogado', '03': 'Anulado',
  '04': 'Suspenso', '05': 'Rescindido', '06': 'Em Execução',
  '07': 'Exec. Suspensa', '08': 'Finalizado'
}
</script>

<template>
  <div class="pt">Situação do Contrato</div>
  <div class="ps">Atualização do status do instrumento contratual</div>

  <div class="card">
    <div class="ch"><h3>Atualizar Status</h3></div>
    <div class="cb">
      <div class="section-title">Identificação</div>
      <div class="fg c3">
        <div class="fgi">
          <label>CNPJ da UG <span class="req">*</span></label>
          <input type="text" id="sc-cnpj" v-model="scCnpj" maxlength="18"
            placeholder="00.000.000/0000-00" @input="onCnpjInput"
            :class="{ inv: isInv('cnpj') }">
        </div>
        <div class="fgi s2">
          <label>ID Contrato PNCP <span class="req">*</span><span class="maxlen">28 car.</span></label>
          <input type="text" id="sc-idcontratopncp" v-model="scIdContratoPNCP" maxlength="28"
            placeholder="ID do contrato" :class="{ inv: isInv('idcontratopncp') }">
        </div>
      </div>

      <div class="section-title">Situação</div>
      <div class="fg c3">
        <div class="fgi s2">
          <label>Situação do Instrumento <span class="req">*</span></label>
          <select id="sc-codigosituacaoinstrumentocontratacao" v-model="scCodigoSituacao"
            :class="{ inv: isInv('codigosituacaoinstrumentocontratacao') }">
            <option value="">Selecione...</option>
            <option value="01">01 - Instrumento Contratual Publicado</option>
            <option value="02">02 - Instrumento Contratual Revogado</option>
            <option value="03">03 - Instrumento Contratual Anulado</option>
            <option value="04">04 - Instrumento Contratual Suspenso</option>
            <option value="05">05 - Rescisão Contratual</option>
            <option value="06">06 - Instrumento Contratual em Execução</option>
            <option value="07">07 - Instrumento Contratual com Execução Suspensa</option>
            <option value="08">08 - Instrumento Contratual Finalizado</option>
          </select>
        </div>
        <div class="fgi s3">
          <label>Justificativa da Situação</label>
          <textarea id="sc-justificativasituacao" v-model="scJustificativa" maxlength="5000" rows="2"
            placeholder="Justificativa (não obrigatório)"></textarea>
        </div>
      </div>

      <div class="acts">
        <button class="btn btn-p" @click="saveSC">Salvar Situação</button>
        <button class="btn btn-s" @click="resetAll">Limpar</button>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="ch">
      <h3>Situações Registradas</h3>
      <span class="tag">{{ db.situacaoContrato.length }} registros</span>
    </div>
    <div class="cb">
      <div class="tw" v-if="db.situacaoContrato.length">
        <table>
          <thead>
            <tr>
              <th>ID PNCP</th>
              <th>CNPJ UG</th>
              <th>Situação</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in db.situacaoContrato" :key="r._id">
              <td>{{ r.idcontratopncp || '-' }}</td>
              <td>{{ r.cnpj || '-' }}</td>
              <td>{{ sitLabel[r.codigosituacaoinstrumentocontratacao] || r.codigosituacaoinstrumentocontratacao || '-' }}</td>
              <td><button class="btn btn-d btn-sm" @click="confirmDel('situacaoContrato', r._id)">Excluir</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="empty" v-else>
        <div class="empty-icon">📌</div>
        <h4>Nenhuma situação</h4>
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
</style>

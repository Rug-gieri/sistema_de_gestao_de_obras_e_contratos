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

function trimVal(v: any): string {
  return String(v ?? '').trim()
}

function valid(fields: string[]): boolean {
  let ok = true
  for (const f of fields) {
    const ref = getRef(f)
    if (!ref || !trimVal(ref.value)) {
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
    vals[f] = ref ? trimVal(ref.value) : ''
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



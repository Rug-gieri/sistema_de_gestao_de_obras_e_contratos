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

  if (efExoneracao.value === '6' && !efDescricaoExoneracao.value.trim()) {
    setInv('descricaoexoneracao', true); ok = false
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
.cond-field { display: none; }
.cond-field.show { display: block; }
</style>

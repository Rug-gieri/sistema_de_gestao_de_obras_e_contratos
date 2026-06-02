<script setup lang="ts">
import { ref, computed } from 'vue'

const fileInput = ref<HTMLInputElement>()

const props = defineProps<{
  prefix: string
  label: string
  hint?: string
  fileIcon?: string
}>()

const emit = defineEmits<{
  change: [name: string, file: File]
}>()

const fileName = ref('')
const fileObj = ref<File | null>(null)
const status = ref<'empty' | 'ok' | 'mismatch'>('empty')

const boxClass = computed(() => ({
  'upload-box': true,
  'has-file': status.value === 'ok',
  'has-error': status.value === 'mismatch'
}))

function handleFile(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  const f = input.files[0]
  fileObj.value = f
  if (!fileName.value) {
    fileName.value = f.name.substring(0, 20)
  }
  status.value = fileName.value === f.name ? 'ok' : 'mismatch'
  emit('change', fileName.value, f)
}

function syncName() {
  if (!fileObj.value) return
  status.value = fileName.value === fileObj.value.name ? 'ok' : 'mismatch'
}

function reset() {
  fileName.value = ''
  fileObj.value = null
  status.value = 'empty'
}

function validate(): boolean {
  if (!fileName.value || !fileObj.value) return false
  return status.value === 'ok'
}

defineExpose({ validate, reset, fileName, fileObj, fileInput })
</script>

<template>
  <div class="fgi">
    <label>
      {{ label }} <span class="req">*</span>
      <span class="hint" v-if="hint">{{ hint }}</span>
    </label>
    <div class="upload-name-row">
      <input type="text" v-model="fileName" maxlength="20"
        :placeholder="'Ex: ' + label.toLowerCase().replace(/ /g,'-') + '.pdf'"
        @input="syncName" />
      <button class="btn btn-s btn-sm" type="button"
        @click="fileInput?.click()">📎</button>
      <input type="file" ref="fileInput" style="display:none"
        accept=".pdf,.PDF,.xlsx,.xls,.ods,.csv,.zip,.rar,.7z"
        @change="handleFile" />
    </div>
    <div :class="boxClass" @click="fileInput?.click()">
      <div class="upload-inner">
        <span class="upload-icon">{{ fileIcon || '📄' }}</span>
        <div class="upload-text">
          <div class="up-hint" v-if="!fileObj">Clique para selecionar o arquivo</div>
          <div class="up-name" v-else-if="status==='ok'">{{ fileObj.name }}</div>
          <div class="up-hint" v-else>Arquivo: {{ fileObj?.name }}</div>
          <div v-if="status==='ok'" class="up-ok">✔ Arquivo confirmado</div>
          <div v-else-if="status==='mismatch'" class="up-err">✗ Nome não coincide</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.upload-box {
  border: 1px dashed #d1d5db; border-radius: 6px; padding: .75rem 1rem;
  background: #fafafa; cursor: pointer; position: relative;
}
.upload-box:hover { border-color: var(--primary); }
.upload-box.has-file { border-color: var(--success); border-style: solid; }
.upload-box.has-error { border-color: var(--danger); border-style: solid; }
.upload-inner { display: flex; align-items: center; gap: 8px; pointer-events: none; }
.upload-icon { font-size: 18px; flex-shrink: 0; }
.upload-text { font-size: 12px; }
.upload-name-row { display: flex; gap: 8px; align-items: flex-end; margin-bottom: 6px; }
.upload-name-row input { flex: 1; }
.up-ok { color: var(--success); font-weight: 700; font-size: 11px; }
.up-err { color: var(--danger); font-weight: 700; font-size: 11px; }
.up-hint { color: var(--muted); font-size: 11px; }
.up-name { font-weight: 700; color: var(--text); font-size: 12px; }
</style>

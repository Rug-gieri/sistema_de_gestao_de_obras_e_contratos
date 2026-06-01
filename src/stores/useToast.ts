import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useToast = defineStore('toast', () => {
  const message = ref('')
  const type = ref<'ok' | 'err'>('ok')
  const visible = ref(false)
  let timer: ReturnType<typeof setTimeout> | null = null

  function show(msg: string, t: 'ok' | 'err' = 'ok') {
    if (timer) clearTimeout(timer)
    message.value = msg
    type.value = t
    visible.value = true
    timer = setTimeout(() => { visible.value = false }, 3000)
  }

  return { message, type, visible, show }
})

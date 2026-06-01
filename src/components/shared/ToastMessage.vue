<script setup lang="ts">
import { useToast } from '../../stores/useToast'

const toast = useToast()
</script>

<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="toast.visible" class="toast" :class="toast.type">
        {{ toast.message }}
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.toast {
  position: fixed; bottom: 20px; right: 20px; z-index: 999;
  background: #1a1f2e; color: #fff; padding: 10px 18px;
  border-radius: 6px; font-size: 12px; font-weight: 600;
  box-shadow: 0 4px 20px rgba(0,0,0,.2);
  max-width: 320px;
}
.toast.ok { border-left: 4px solid #22c55e; }
.toast.err { border-left: 4px solid #c62828; }
.toast-enter-active { transition: all .25s ease; }
.toast-leave-active { transition: all .25s ease; }
.toast-enter-from { transform: translateY(80px); opacity: 0; }
.toast-leave-to { transform: translateY(80px); opacity: 0; }
</style>

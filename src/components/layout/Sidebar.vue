<script setup lang="ts">
defineProps<{
  currentRoute: string
  badges: {
    nc: number
    no: number
    ac: number
    ao: number
    ef: number
    sc: number
  }
  open?: boolean
}>()

const emit = defineEmits<{
  navigate: [pageId: string]
}>()

const sections = [
  {
    label: null,
    items: [
      { id: 'home', label: 'Início', icon: '🏠' },
    ],
  },
  {
    label: 'Novos',
    items: [
      { id: 'nc', label: 'Contratos', icon: '📄' },
      { id: 'no', label: 'Obras', icon: '🏗️' },
    ],
  },
  {
    label: 'Em Andamento',
    items: [
      { id: 'ac', label: 'Acomp. Contratos', icon: '📋' },
      { id: 'ao', label: 'Acomp. Obras', icon: '🔍' },
    ],
  },
  {
    label: 'Other',
    items: [
      { id: 'ef', label: 'Exoneração Fiscal', icon: '💰' },
      { id: 'sc', label: 'Situação Contrato', icon: '📌' },
    ],
  },
]

function nav(id: string) {
  emit('navigate', id)
}
</script>

<template>
  <aside class="sidebar" :class="{ open: open }">
    <nav>
      <template v-for="section in sections" :key="section.label">
        <div v-if="section.label" class="sl">{{ section.label }}</div>
        <div
          v-for="item in section.items"
          :key="item.id"
          class="si"
          :class="{ active: currentRoute === item.id }"
          @click="nav(item.id)"
        >
          <span class="si-icon">{{ item.icon }}</span>
          <span class="si-label">{{ item.label }}</span>
          <span v-if="badges[item.id as keyof typeof badges]" class="bdg">{{ badges[item.id as keyof typeof badges] }}</span>
        </div>
      </template>
    </nav>
    <div class="sidebar-footer">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
      <span>Porto Velho / RO</span>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 238px;
  flex-shrink: 0;
  background: #fff;
  border-right: 1px solid var(--border);
  padding: 0 0 80px;
  position: sticky;
  top: 96px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.sidebar-logo-wrap {
  padding: 14px 16px 12px;
  border-bottom: 1px solid var(--border);
  background: #fafafa;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.sidebar-logo {
  height: 34px;
  width: auto;
}

.sidebar-logo-sub {
  font-family: var(--font-head);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--muted);
  text-align: center;
  line-height: 1.4;
}

.sl {
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 1.2px;
  color: var(--muted);
  text-transform: uppercase;
  padding: 0 1.1rem;
  margin: 0.85rem 0 3px;
  font-family: var(--font-head);
}

.si {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 1.1rem;
  cursor: pointer;
  font-size: 12.5px;
  color: var(--label);
  border-left: 3px solid transparent;
  transition: all .12s;
  font-family: var(--font);
}

.si:hover {
  background: #f8f9fa;
  color: var(--primary);
}

.si.active {
  background: #f8f9fa;
  color: var(--primary);
  border-left-color: var(--primary);
  font-weight: 600;
}

.si-icon {
  font-size: 15px;
  line-height: 1;
  width: 20px;
  text-align: center;
}

.si-label {
  flex: 1;
}

.bdg {
  margin-left: auto;
  background: #e5e7eb;
  color: var(--muted);
  border-radius: 10px;
  padding: 1px 6px;
  font-size: 10px;
  font-weight: 600;
}

.si.active .bdg {
  background: var(--primary);
  color: #fff;
}

.sidebar-footer {
  margin-top: auto;
  padding: 12px 1.1rem;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--muted);
  font-family: var(--font-head);
  font-weight: 600;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 105;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    box-shadow: 10px 0 30px rgba(0, 0, 0, 0.1);
  }

  .sidebar.open {
    transform: translateX(0);
  }
}
</style>

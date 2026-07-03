<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const routes: Record<string, string> = {
  nc: '/contratos',
  no: '/obras',
  ac: '/acomp-contratos',
  ao: '/acomp-obras',
  dash: '/dashboard',
}

const cards = [
  { id: 'nc', icon: '📄', label: 'Novos Contratos', desc: 'Cadastro de novos instrumentos contratuais' },
  { id: 'no', icon: '🏗', label: 'Novas Obras', desc: 'Registro de obras e engenharia' },
  { id: 'ac', icon: '📋', label: 'Acomp. Contratos', desc: 'Acompanhamento de aditivos e apostilamentos' },
  { id: 'ao', icon: '⚙', label: 'Acomp. Obras', desc: 'Medição e evolução de obras' },
  { id: 'dash', icon: '📊', label: 'Visão Geral', desc: 'Painel consolidado com indicadores' },
]

function goTo(cardId: string) {
  router.push(routes[cardId] || '/')
}
</script>

<template>
  <div class="pt">Início</div>
  <div class="ps">Selecione uma opção para gerenciar contratos e obras</div>
  <div class="home-grid">
    <div
      v-for="card in cards"
      :key="card.id"
      class="home-card"
      @click="goTo(card.id)"
    >
      <div class="home-icon">{{ card.icon }}</div>
      <div class="home-label">{{ card.label }}</div>
      <div class="home-desc">{{ card.desc }}</div>
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
.home-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  padding: 1rem 0;
}
.home-card {
  background: var(--card, #ffffff);
  border: 1px solid var(--border, #cdd6e8);
  border-radius: 8px;
  padding: 1.75rem 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.home-card:hover {
  transform: translateY(-3px);
  border-color: var(--primary, #0a4a8f);
  box-shadow: 0 4px 16px rgba(10, 74, 143, 0.1);
}
.home-icon {
  font-size: 2.5rem;
  background: #f5f5f5;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;
}
.home-card:hover .home-icon {
  background: var(--primary, #0a4a8f);
  color: #fff;
}
.home-label {
  font-family: var(--font-head, 'Montserrat', system-ui, sans-serif);
  font-weight: 600;
  font-size: 15px;
  color: var(--text, #1a1f2e);
}
.home-desc {
  font-size: 12px;
  color: var(--muted, #5a6478);
  line-height: 1.4;
}
</style>

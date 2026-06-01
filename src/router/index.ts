import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('../pages/HomePage.vue') },
  { path: '/dashboard', name: 'dash', component: () => import('../pages/DashboardPage.vue') },
  { path: '/contratos', name: 'nc', component: () => import('../pages/NovosContratosPage.vue') },
  { path: '/obras', name: 'no', component: () => import('../pages/NovasObrasPage.vue') },
  { path: '/acomp-contratos', name: 'ac', component: () => import('../pages/AcompContratosPage.vue') },
  { path: '/acomp-obras', name: 'ao', component: () => import('../pages/AcompObrasPage.vue') },
  { path: '/exoneracao', name: 'ef', component: () => import('../pages/ExoneracaoFiscalPage.vue') },
  { path: '/situacao', name: 'sc', component: () => import('../pages/SituacaoContratoPage.vue') },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})

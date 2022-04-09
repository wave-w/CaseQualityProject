import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login/index.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/home',
    name: HTMLModElement,
    component: () => import('../views/Home/index.vue'),
    children: [
      {
        path: '/index',
        name: 'Index',
        component: () => import('../views/RecordImport/index.vue'),
      },
      {
        path: '/diagnosedCaseList',
        name: 'diagnosedCaseList',
        component: () => import('../views/CaseList/DiagnosedCaseList/index.vue'),
      },
      {
        path: '/notDiagnosedCaseList',
        name: 'notDiagnosedCaseList',
        component: () => import('../views/CaseList/NotDiagnosedCaseList/index.vue'),
      },
      {
        path: '/patientDetail',
        name: 'patientDetail',
        component: () => import('../views/PatientDetail/index.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !sessionStorage.getItem('token')) {
    next({ name: 'Login' });
  }
  next();
});

export default router;

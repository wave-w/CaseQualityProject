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
    name: 'Home',
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
        path: '/patientDetail/:type/:id',
        name: 'patientDetail',
        component: () => import('../views/PatientDetail/index.vue'),
      },
      {
        path: '/personal',
        name: 'Personal',
        component: () => import('../views/Personal/index.vue'),
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

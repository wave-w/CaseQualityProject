import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import App from './App.vue';
import router from './router';
import 'element-plus/dist/index.css';
import './assets/style/normal.scss';
import i18n from './assets/lang/i18n';
import './assets/style/iconfont.scss';

createApp(App).use(router).use(ElementPlus, {
  locale: zhCn,
}).use(i18n)
  .mount('#app');

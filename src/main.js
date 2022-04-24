import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import SvgIcon from './components/SvgIcon/index.vue';// svg component
import App from './App.vue';
import router from './router';
import 'element-plus/dist/index.css';
import './assets/style/normal.scss';
import i18n from './assets/lang/i18n';
import './assets/style/iconfont.scss';

const req = import.meta.globEager('./icons/svg/*.svg');
const requireAll = (requireContext) => Object.keys(requireContext);
console.log(requireAll(req));
createApp(App).use(router).use(ElementPlus, {
  locale: zhCn,
}).use(i18n)
  .component('svg-icon', SvgIcon)
  .mount('#app');

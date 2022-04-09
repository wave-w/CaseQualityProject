import { createI18n } from 'vue-i18n/index';

import global from './global';
import login from './login';
import caseList from './caseList';
import recordImport from './recordImport';

const locale = localStorage.getItem('locale') ? localStorage.getItem('locale') : 'zh';
const i18n = createI18n({
  locale, // 设置地区
  messages: {
    zh: {
      login: login.zh,
      global: global.zh,
      caseList: caseList.zh,
      recordImport: recordImport.zh,
    },
    en: {
      login: login.en,
      global: global.en,
      caseList: caseList.en,
      recordImport: recordImport.en,
    },
  },
});

export default i18n;

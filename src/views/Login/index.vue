<template>
  <div class="main">
    <div class="switch_language" @click="switchLanguage">
      {{ $t('global.switchLanguage') }}
      <span class="iconfont icon-jiantou_zuoyouqiehuan" />
    </div>
    <el-card class="loginBox" shadow="always">
      <el-form ref="loginFromRef" :model="loginFrom" :rules="loginLules">
        <el-form-item prop="email">
          <el-input v-model="loginFrom.email">
            <template #prefix>
              <span class="iconfont icon-zhanghao" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input v-model="loginFrom.passWord" type="password">
            <template #prefix>
              <span class="iconfont icon-mima" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item class="verification_code" prop="verificationCode">
          <el-input v-model="loginFrom.verificationCode"
                    class="verification_code_input"
          >
            <template #prefix>
              <span class="iconfont icon-yanzhengma" />
            </template>
          </el-input>
          <span v-if="isShowCodeTime" class="verification_code_text">
            {{ $t('login.sending') }} {{ codeTime }}
          </span>
          <span v-else class="verification_code_text" @click="getCodeText">
            {{ codeText }}
          </span>
        </el-form-item>
        <el-form-item :label-width="180">
          <el-button type="primary" size="small" @click="toLogin">
            {{ $t('login.login') }}
          </el-button>
          <el-button size="small" @click="clearForm">
            {{ $t('login.clear') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  computed, defineComponent, reactive, ref,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { login, getCode } from '../../api/login/index';

export default defineComponent({
  name: 'LoginIndex',
  setup() {
    const { t, locale } = useI18n();
    const loginFromRef = ref('');
    const router = useRouter();

    const loginFrom = reactive({
      email: '1457056953@qq.com', //
      passWord: '123456',
      verificationCode: '',
    });

    const codeText = computed(() => t('login.getVerificationCode'));// ref(t('login.getVerificationCode'));
    const codeTime = ref(60);
    const isShowCodeTime = ref(false);

    // elementUI表单自定义规则验证邮箱格式
    const VerifyEmailbox = (rule, value, callback) => {
      // eslint-disable-next-line max-len
      const emailReg = /^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      if (!emailReg.test(value)) {
        callback(new Error(t('login.enteremail')));
      } else {
        callback();
      }
    };

    const loginLules = {
      email: [{
        validator: VerifyEmailbox,
        trigger: 'blur',
      }],
      passWord: [{
        required: true,
        message: t('login.enterPassword'),
        trigger: 'blur',
      }],
      verificationCode: [{
        required: true,
        message: t('login.enterVerificationCode'),
        trigger: 'blur',
      }],
    };

    function toLogin() {
      loginFromRef.value.validate((validate) => {
        if (validate) {
          login(loginFrom.verificationCode).then((res) => {
            if (res.data.success) {
              sessionStorage.setItem('token', res.data.token);
              router.push('/index');
            } else {
              ElMessage({
                type: 'error',
                message: t('login.verificationCodeError'),
              });
            }
          });
        }
      });
    }

    function clearForm() {
      loginFromRef.value.resetFields();
    }

    function getCodeText() {
      if (!loginFrom.email || !loginFrom.passWord) {
        ElMessage({
          message: t('login.isHaveInfo'),
          type: 'warning',
        });
        return;
      }
      getCode(loginFrom.email, loginFrom.passWord).then((res) => {
        if (res.data.success) {
          localStorage.setItem('userData', JSON.stringify(res.data.data));
          isShowCodeTime.value = true;
          const codeTimeId = setInterval(() => {
            codeTime.value -= 1;
            if (codeTime.value <= 0) {
              clearInterval(codeTimeId);
              isShowCodeTime.value = false;
              codeTime.value = 60;
            }
          }, 1000);
        } else {
          ElMessage({
            message: t('login.errorInfo'),
            type: 'error',
          });
        }
      });
    }

    function switchLanguage() {
      locale.value = locale.value === 'zh' ? 'en' : 'zh';
      localStorage.setItem('locale', locale.value);
      router.go('0');
    }

    return {
      loginFrom,
      loginFromRef,
      codeText,
      codeTime,
      isShowCodeTime,
      loginLules,
      toLogin,
      clearForm,
      getCodeText,
      switchLanguage,
    };
  },
});
</script>

<style scoped lang="scss">
.main {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background: url('../../assets/image/school.jpg') no-repeat;
  background-size: 100%;
  .switch_language {
    position: absolute;
    display: flex;
    justify-content: space-around;
    align-items: center;
    top: 100px;
    right: 0;
    padding: 0 10px;
    height: 40px;
    border-radius: 10px 0 0 10px;
    cursor: pointer;
    color: #fff;
    background-color: blue;
  }
  .loginBox {
    display: flex;
    width: 400px;
    height: 300px;
    opacity: 0.8;
    justify-content: center;
    align-items: center;
    .verification_code {
      .verification_code_input {
        width: 45%;
      }
      .verification_code_text {
        margin: 0 5px;
        padding: 5px;
        cursor: pointer;
      }
      .verification_code_text:hover {
        color: blue;
      }
    }
  }
  .iconfont {
    display: flex;
    align-items: center;
  }
}
</style>

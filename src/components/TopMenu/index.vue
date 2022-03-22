<template>
  <div class="top_menu">
    <div class="menu_left">
      <i :class="!collapse?'iconfont icon-shouqicaidan':'iconfont icon-zhankaicaidan'"
         @click="collapseMenu"
      />
      <span>{{ $t('global.systemName') }}</span>
    </div>
    <div class="menu_right">
      <i class="iconfont icon-xiaoxizhongxin" />
      <img src="../../assets/image/avatar_img.jpg" class="avatar_img">
      <el-dropdown trigger="click" @command="getCommand"
                   @visible-change="showMenu"
      >
        <span class="el-dropdown-link">
          {{ title }} {{ doctorName }}
          <i
            :class="isShowDropdownMenu?'iconfont icon-xiangshang_jiantou':'iconfont icon-xiangxiajiantou1'"
          />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :command="'/personal'">
              {{ $t('global.personal') }}
            </el-dropdown-item>
            <el-dropdown-item :command="''">
              {{ $t('global.logout') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <el-dialog v-model="loginoutVisible" :title="$t('global.logout')" width="30%">
    <span>{{ $t('global.logoutConfirm') }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="loginoutVisible = false">{{ $t('global.cancel') }}
        </el-button>
        <el-button type="primary" @click="toLoginout">{{ $t('global.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ElMessage } from 'element-plus';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { logout } from '../../api/login/index';

export default defineComponent({
  name: 'TopMenu',
  props: {
    collapse: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['collapse-click'],
  setup(props, context) {
    const { doctorName, title } = JSON.parse(localStorage.getItem('userData'));
    const router = useRouter();
    const t = useI18n();

    const isShowDropdownMenu = ref(false);
    const loginoutVisible = ref(false);

    function collapseMenu() {
      context.emit('collapse-click');
    }
    function getCommand(command) {
      if (command) {
        router.push(command);
        return;
      }
      loginoutVisible.value = true;
    }
    function toLoginout() {
      logout().then((res) => {
        if (res.data.success) {
          localStorage.clear('doctorName');
          router.push('/');
        } else {
          ElMessage({
            type: 'error',
            message: t('login.logout'),
          });
        }
        loginoutVisible.value = false;
      });
    }
    function showMenu(visible) {
      isShowDropdownMenu.value = visible;
    }
    return {
      doctorName,
      title,
      isShowDropdownMenu,
      loginoutVisible,
      collapseMenu,
      getCommand,
      showMenu,
      toLoginout,
    };
  },
});
</script>

<style  scoped lang='scss'>
.top_menu {
  display: flex;
  justify-content: space-between;
  height: 60px;
  background-color: #242f42;
  .menu_left {
    display: flex;
    height: 100%;
    padding: 0 15px;
    color: #fff;
    justify-content: space-around;
    align-items: center;
    .iconfont {
      padding: 0 5px 0 0;
      font-size: 30px;
    }
  }
  .menu_right {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-right: 50px;
    color: #fff;
    .avatar_img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin: 0 10px 0 20px;
    }
    .iconfont {
      margin: 0 0 0 5px;
    }
    .icon-xiaoxizhongxin {
      font-size: 25px;
    }
    .el-dropdown-link {
      color: #fff;
    }
  }
}
</style>

<template>
  <el-menu
    background-color="#324157"
    text-color="#fff"
    unique-opened
    router
    :default-active="selectIndex"
    :collapse="collapse"
    @select="toSelectIndex"
  >
    <el-menu-item index="/index">
      <i class="iconfont icon-shouye-shouye" />
      <span>{{ $t('global.homePage') }}</span>
    </el-menu-item>
    <el-sub-menu index="/">
      <template #title>
        <i :class="['iconfont', 'icon-bingli1', isActive ? 'active_state' : '']" />
        <span>{{ $t('global.caseList') }}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/diagnosedCaseList">
          <i class="iconfont icon-bingli1" />
          <span>{{ $t('global.diagnosedCaseList') }}</span>
        </el-menu-item>
        <el-menu-item index="/notDiagnosedCaseList">
          <i class="iconfont icon-bingli1" />
          <span>{{ $t('global.notDiagnosedCaseList') }}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
    <el-menu-item index="/personal">
      <i class="iconfont icon-geren" />
      <span>{{ $t('global.personal') }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'WMenu',
  props: {
    collapse: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const route = useRoute();
    const selectIndex = ref(route.path);

    const isActive = computed(
      () => (selectIndex.value === '/diagnosedCaseList'
         || selectIndex.value === '/notDiagnosedCaseList'),
    );

    if (sessionStorage.getItem('selectIndex')) {
      selectIndex.value = sessionStorage.getItem('selectIndex');
    }
    function toSelectIndex(index) {
      sessionStorage.setItem('selectIndex', index);
      selectIndex.value = index;
    }
    return {
      selectIndex,
      isActive,
      toSelectIndex,
    };
  },
});
</script>

<style  scoped lang='scss'>
.iconfont {
  padding: 0 10px 0 0;
  font-size: 16px;
}
.icon-shouye-shouye {
  font-size: 20px;
}
.el-menu {
  height: 100%;
  :deep(.el-sub-menu) {
    width: 200px;
  }
}
.el-menu--collapse {
  :deep(.el-sub-menu) {
    width: 100%;
  }
  .active_state {
  color: #409eff !important;
}
}
</style>

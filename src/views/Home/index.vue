<template>
  <div class="main">
    <top-menu :collapse="collapse" @collapse-click="collapseClick" />
    <div class="main_menu">
      <div class="el_menu">
        <w-menu :collapse="collapse" />
      </div>
      <div class="router_view">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import TopMenu from '../../components/TopMenu/index.vue';
import WMenu from '../../components/WMenu/index.vue';

export default defineComponent({
  name: 'HomeIndex',
  components: { WMenu, TopMenu },
  setup() {
    const collapse = ref(true);
    function collapseClick() {
      collapse.value = !collapse.value;
    }
    return {
      collapse,
      collapseClick,
    };
  },
});
</script>

<style  scoped lang='scss'>
.main {
  display: flex;
  flex-direction: column;
  height: 100%;
  .main_menu {
    display: flex;
    justify-content: space-between;
    flex: 1;
    .router_view {
      flex: 1;
      overflow: hidden;
    }
  }
}
</style>

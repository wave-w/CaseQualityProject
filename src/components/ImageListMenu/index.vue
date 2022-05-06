<template>
  <div class="main">
    <div
      v-for="(url, index) in imageList"
      :key="index"
      :class="['image_box', index === activeIndex ? 'active_class' : '']"
      @click="$emit('selectImage', index)"
    >
      <img :src="url">
      <div>{{ $t('caseList.ultrasonic_image') }}{{ index + 1 }}</div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ImageListMenu',
  props: {
    imageList: {
      type: Array,
      default: () => [],
    },
    activeIndex: {
      type: Number,
      default: -1,
    },
  },
  emits: ['selectImage'],
});
</script>

<style scoped lang='scss'>
.main {
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 750px !important;
  overflow: hidden;
  overflow-y: auto;
  background: #000;
  .image_box {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 200px;
    height: 200px;
    margin: 5px 0;
    color: #fff;
    cursor: pointer;
    img {
      width: 180px;
      height: 180px;
    }
  }
  .image_box:hover {
    color: #e90f0f;
  }
  .active_class {
    color: #e90f0f;
  }
}
.main::-webkit-scrollbar { display: none; }
</style>

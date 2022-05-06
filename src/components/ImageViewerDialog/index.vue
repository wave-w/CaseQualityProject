<template>
  <div class="main_dialog">
    <image-list-menu
      :image-list="imageList"
      :active-index="activeImageIndex"
      @select-image="selectImage"
    />
    <imaging-viewer
      :image-url="imageUrl"
      :is-has-previous-image="isHasPreviousImage"
      :is-has-next-image="isHasNextImage"
      @to-last-image="lastImage"
      @to-next-image="toNextImage"
    />
    <i class="iconfont icon-cha" @click="$emit('imageDialogClose')" />
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import ImageListMenu from '../ImageListMenu/index.vue';
import ImagingViewer from '../ImagingViewer/index.vue';

export default defineComponent({
  name: 'ImageViewerDialog',
  components: { ImageListMenu, ImagingViewer },
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
  emits: ['imageDialogClose'],
  setup(props) {
    const imageUrl = ref('');
    const isHasPreviousImage = ref(false);
    const isHasNextImage = ref(false);
    const activeImageIndex = ref(-1);

    const setSwitchBtnState = (index) => {
      if (props.imageList.length < 1) {
        isHasNextImage.value = false;
        isHasPreviousImage.value = false;
      }

      if (index < props.imageList.length - 1) {
        isHasNextImage.value = true;
      } else {
        isHasNextImage.value = false;
      }

      if (index > 0) {
        isHasPreviousImage.value = true;
      } else {
        isHasPreviousImage.value = false;
      }
    };
    const selectImage = (index) => {
      setSwitchBtnState(index);
      activeImageIndex.value = index;
      imageUrl.value = props.imageList[index];
    };
    const lastImage = () => {
      selectImage(activeImageIndex.value - 1);
    };
    const toNextImage = () => {
      selectImage(activeImageIndex.value + 1);
    };

    onMounted(() => {
      activeImageIndex.value = props.activeIndex;
      imageUrl.value = props.imageList[activeImageIndex.value];
      setSwitchBtnState(activeImageIndex.value);
    });

    return {
      imageUrl, isHasPreviousImage, isHasNextImage, activeImageIndex, lastImage, toNextImage, selectImage,
    };
  },
});
</script>

<style scoped lang='scss'>
.main_dialog {
  display: flex;
  margin-left: 300px;
  width: 1200px;
  background: #eee;
  i {
    position: absolute;
    right: 0;
    padding: 10px;
    font-size: 25px;
    color: #fff;
    cursor: pointer;
  }
}
</style>

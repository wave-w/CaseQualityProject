<template>
  <svg :class="svgClass" aria-hidden="true" v-bind="$attrs">
    <use :xlink:href="iconFullName" />
  </svg>
</template>

<script>
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'SvgIcon',
  props: {
    iconName: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const iconFullName = computed(() => `#icon-${props.iconName}`);
    const svgClass = computed(() => {
      if (props.className) {
        return `svg-icon ${this.className}`;
      }
      return 'svg-icon';
    });
    return {
      iconFullName, svgClass,
    };
  },
});
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>

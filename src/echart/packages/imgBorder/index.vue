<template>
  <div :class="[b(),className]"
       :style="styleSizeName"
       @mouseenter="handleMouseEnter"
       @mouseleave="handleMouseLeave"
       @dblclick="handleDblClick"
       @click="handleClick">
    <div :style="[styleChartName,styleImgName]"></div>
  </div>
</template>

<script>
import create from "../../create";
export default create({
  name: "imgborder",
  computed: {
    styleImgName () {
      return Object.assign({
        width: "100%",
        height: "100%",
        backgroundColor:
          this.option.backgroundColor || "rgba(180, 181, 198, 0.1)",
        backgroundClip: "padding-box",
        opacity: this.option.opacity || 1,
        filter: "blur(0px)"
      }, (() => {
        if (!this.validatenull(this.dataChart)) {
          return {
            borderImageSource: "url(" + this.dataChart + ")",
            borderImageSlice: "10 16 15 10 fill",
            borderWidth: "10px",
            borderStyle: "solid",
            boxSizing: "border-box",
          }
        }
        return {}
      })())
    }
  },
  methods: {

  }
});
</script>


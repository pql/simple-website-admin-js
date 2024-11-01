<template>
  <div>
    <el-form-item label="文本数据">
      <avue-input type="text" v-model="main.activeOption.data"></avue-input>
    </el-form-item>
    <el-form-item label="文本配置">
      <avue-input type="text" v-model="main.activeOption.value"></avue-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "demo",
  inject: ["main"],
};
</script>

<style>
</style>
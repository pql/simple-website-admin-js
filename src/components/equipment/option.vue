<template>
  <div>
    <el-form-item label="设备编码">
      <avue-input type="text" v-model="main.activeObj.data.equipmentId"></avue-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "equipment",
  inject: ["main"],
};
</script>
<template>
  <div @click="onSelectEquipment">
    <span
      :style="{
        'border-radius': '3rem 3rem 0',
        border: '1px solid #ffffff',
        width: '3rem',
        height: '3rem',
        'background-color': `${
          deviceStatuEntity.messageBackgroundColorCode || ''
        }`,
      }"
      class="block relative rotate-45"
    >
      <span
        v-if="deviceStatuEntity && deviceStatuEntity.statusIconFontBase64String"
        :style="{
          top: '0.8rem',
          'background-size': '100% 100%',
          'background-attachment': 'fixed',
          'background-image': `url(${deviceStatuEntity.statusIconFontBase64String})`,
        }"
        class="-rotate-45 w-1/2 h-1/2 bg-cover block relative"
      ></span>
    </span>
    <span
      v-if="
        (deviceDetail && deviceDetail.deviceName) ||
        (dataChart && dataChart.equipmentName)
      "
      class="text-white block relative text-center text-lg top-4"
      >{{ dataChart.equipmentName || deviceDetail.deviceName }}</span
    >
  </div>
</template>

<script>
import { deserialize } from "@/shared/utils/serializer";
import { ControlPanelService } from "@/shared/api/services/ControlPanelService";
export default {
  name: "equipment",
  data() {
    return {
      planDeviceDetail: [],
      deviceDetail: null,
      deviceStatuEntity: null,
    };
  },
  computed: {},
  created() {},
  mounted() {
    // 监听事件
    window.addEventListener("message", (e) => {
      console.log("接收到iframe外层传来message", e.data);
      if (typeof e.data === "string") {
        const data = deserialize(e.data);
        const { equipmentId, type } = data;
        if (type === "updateDeviceStatus") {
          this.initEquipmentData(equipmentId);
        }
      }
    });
  },
  methods: {
    async initEquipmentData(equipmentId) {
      const ret = await this.getControlPanelPlainDevicePointsDetails(
        equipmentId
      );
      this.planDeviceDetail = (ret && ret.planDeviceDetail) || [];
      this.deviceDetail = (ret && ret.planDeviceDetail[0]) || {};
      this.deviceStatuEntity =
        (ret && ret.planDeviceDetail[0]).deviceStatuEntity || {};
      console.log("deviceStatuEntity", this.deviceStatuEntity);
    },
    postMessageValue(value) {
      window.parent.postMessage(JSON.stringify(value), "*");
    },
    async getControlPanelPlainDevicePointsDetails(deviceId) {
      const ret =
        await ControlPanelService.postApiAppControlPanelPlanDevicePointsDetails(
          {
            requestBody: {
              deviceIdList: [deviceId],
            },
          }
        );
      return ret;
    },
    onSelectEquipment() {
      const { equipmentId } = this.dataChart;
      const data = {
        description: "avue传值给顶层页面",
        type: "tapedEquipment",
        equipmentId,
      };
      this.postMessageValue(data);
    },
  },
  props: {},
  watch: {
    "dataChart.equipmentId": {
      handler(newEquipmentId) {
        this.initEquipmentData(newEquipmentId);
      },
    },
  },
};
</script>
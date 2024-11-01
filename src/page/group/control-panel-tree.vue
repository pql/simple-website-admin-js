<template>
  <div>
    <Input @change="onChange">
      <template #addonAfter>
        <Icon type="search" />
      </template>
    </Input>
    <Tree
      :tree-data="treeData"
      :replace-fields="replaceFields"
      :load-data="handleLoadData"
      @select="handleSelectNode"
    >
      <a-icon class="icon" slot="switcherIcon" type="down" />
      <template slot="title" slot-scope="scope">
        <span v-if="scope.dataRef.nodeName.indexOf(searchValue) > -1">
          {{
            scope.dataRef.nodeName.substr(
              0,
              scope.dataRef.nodeName.indexOf(searchValue)
            )
          }}
          <span class="selected">{{ searchValue }}</span>
          {{
            scope.dataRef.nodeName.substr(
              scope.dataRef.nodeName.indexOf(searchValue) + searchValue.length
            )
          }}
        </span>
        <span v-else>{{ scope.dataRef.nodeName }}</span>
      </template>
    </Tree>
  </div>
</template>

<script setup>
import { Tree, Input, Button, Icon } from "ant-design-vue";
import { defineComponent, unref, ref, onMounted, defineEmits } from "vue";
import { warn } from "@/shared/utils/log";
import { isArray } from "@/shared/utils/is";
import { listToTree } from "@/shared/utils/helper/treeHelper";
import { ControlPanelTreeNodeService } from "@/shared/api/services/ControlPanelTreeNodeService";

const emit = defineEmits(['select']);

defineComponent({
  name: "ControlPanelTree",
});

// 搜索字段
const searchValue = ref("");

// 数据源，二维数组
const dataSource = ref([]);
// 树数据，树状结构
const treeData = ref([]);
const replaceFields = {
  children: "children",
  title: "nodeName",
  key: "nodeId",
};
const treeHelperConfig = {
  id: "nodeId",
  children: "children",
  pid: "parentNodeId",
};

// 初始化树节点数据
const getTreeData = async (options) => {
  try {
    const ret =
      await ControlPanelTreeNodeService.postApiAppControlPanelTreeNodeControlePanelTreeNodeLoading(
        {
          requestBody: options,
        }
      );
    const list = isArray(ret) ? ret : [];
    return list;
  } catch (e) {
    warn(e);
  }
};

const onChange = (e) => {
  const value = e.target.value;
  searchValue.value = value;
};

// 异步加载数据
const handleLoadData = async (node) => {
  const dataList = await getTreeData({
    filter: searchValue.value,
    parentId: node.dataRef.nodeId,
    type: node.dataRef.type,
    id: node.dataRef.id,
  });

  setTimeout(() => {
    node.dataRef.children = [...dataList];
    treeData.value = [...treeData.value];
  }, 0);
};

const handleSelectNode = (...args) => {
  emit('select', ...args)
};

onMounted(async () => {
  // 初始化site数据
  const dataList = await getTreeData({
    type: "site",
  });
  const nodeList = listToTree(dataList, treeHelperConfig);
  treeData.value = nodeList;
});
</script>

<style lang="less">
@import "@/shared/design/color.less";

.ant-tree li .ant-tree-node-content-wrapper {
  color: var(--text-color);
}

.icon {
  color: var(--text-color);
}

.selected {
  color: @primary-color;
}
</style>
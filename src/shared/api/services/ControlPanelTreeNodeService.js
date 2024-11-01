import { defHttp } from '@/shared/utils/http/axios';

export const ControlPanelTreeNodeService = {
    /**
     * @property {string|undefined} nodeId
     * @property {string|undefined} type
     * @returns FireBytes_Unified_Wave_ControlPanelTreeNodes_Dtos_ShowTablePanelInfoDto Success
     */
    getApiAppControlPanelTreeNodeShowTablePanelInfo({ nodeId, type }) {
        return defHttp.request({
            method: 'GET',
            url: '/api/app/control-panel-tree-node/show-table-panel-info',
            params: {
                'NodeId': nodeId,
                'Type': type,
            }
        });
    },
    /**
     * @property {FireBytes_Unified_Wave_ControlPanelTreeNodes_Dtos_ControlePanelTreeNodeLoadingRequest} requestBody
     * @returns FireBytes_Unified_Wave_ControlPanelTreeNodes_Dtos_ControlePanelTreeNodeLoadingDto Success
     */
    postApiAppControlPanelTreeNodeControlePanelTreeNodeLoading({
        requestBody,
    }) {
        return defHttp.request({
            method: 'POST',
            url: '/api/app/control-panel-tree-node/controle-panel-tree-node-loading',
            data: requestBody,
        });
    }
}
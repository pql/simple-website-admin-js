import { defHttp } from '@/shared/utils/http/axios';

export const ControlPanelService = {
    /**
     * @property {string|undefined} controlPanelId
     * @property {string|undefined} graphicPanelId
     * @returns FireBytes_Unified_Wave_ControlPanels_Dto_GetFloorPlanConfigOutput Success
     */
    getApiAppControlPanelFloorPlanConfig({ controlPanelId, graphicPanelId }) {
        return defHttp.request({
            method: 'GET',
            url: '/api/app/control-panel/floor-plan-config',
            params: {
                'ControlPanelId': controlPanelId,
                'GraphicPanelId': graphicPanelId,
            }
        });
    },
    /**
     * @returns FireBytes_Unified_Wave_ControlPanels_Dto_DeviceStatusDto Success
     */
    getApiAppControlPanelDeviceStatus() {
        return defHttp.request({
            method: 'GET',
            url: '/api/app/control-panel/device-status',
        });
    },
    /**
     * @property {string|undefined} boundBuildingId
     * @property {string|undefined} graphicPanelId
     * @property {boolean|undefined} isMapViewer
     * @returns FireBytes_Unified_Wave_ControlPanels_Dto_ControlPanelImageMarkerDto Success
     */
    getApiAppControlPanelImagePlanDevicePoints({
        boundBuildingId,
        graphicPanelId,
        isMapViewer,
    }) {
        return defHttp.request({
            method: 'GET',
            url: '/api/app/control-panel/image-plan-device-points',
            params: {
                'BoundBuildingId': boundBuildingId,
                'GraphicPanelId': graphicPanelId,
                'IsMapViewer': isMapViewer,
            }
        })
    },
    postApiAppControlPanelPlanDevicePointsDetails({
        requestBody
    }) {
        return defHttp.request({
            method: 'POST',
            url: '/api/app/control-panel/plan-device-points-details',
            data: requestBody,
        });
    }
}
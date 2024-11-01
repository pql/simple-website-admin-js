import { defHttp } from "@/shared/utils/http/axios";

export const BladeVisualService = {
  /**
   * @returns FireBytes_Unified_Avue_BladeVisuals_Dtos_GetBladeVisualForEditOutput Success
   * @throws ApiError
   */
  getApiAppBladeVisual(id) {
    return defHttp.request({
      method: "GET",
      url: `/api/app/blade-visual/${id}`,
    });
  },
  putApiAppBladeVisual(data){
    return defHttp.request({
      method: "PUT",
      url: `/api/app/blade-visual`,
      data: data
    });
  }
}

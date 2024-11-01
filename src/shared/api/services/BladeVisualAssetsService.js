import { defHttp } from "@/shared/utils/http/axios";

export const BladeVisualAssetsService = {
  /**
   * @returns FireBytes_Unified_Avue_BladeVisuals_Dtos_GetBladeVisualForEditOutput Success
   * @throws ApiError
   */
  getVisualAssets(id) {
    return defHttp.request({
      method: "GET",
      url: `/api/app/blade-visual-assets/${id}`,
    });
  },
  postVisualAssets(data){
    return defHttp.request({
      method: "POST",
      url: `/api/app/blade-visual-assets`,
      data: data
    });
  },
  deleteVisualAssets(id) {
    return defHttp.request({
      method: "DELETE",
      url: `/api/app/blade-visual-assets/${id}`,
    });
  },
  getVisualAssetsList(params) {
    return defHttp.request({
      method: "GET",
      url: `/api/app/blade-visual-assets/paged`,
      params: params
    });
  }
}

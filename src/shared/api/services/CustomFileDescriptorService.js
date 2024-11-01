import { defHttp } from '@/shared/utils/http/axios';

export const CustomFileDescriptorService = {
    /**
     * @property {string} fileId
     * @returns FireBytes_Unified_FileDescriptors_Dtos_PreviewImagesDto Success
     */
    postApiAppCustomFileDescriptorPreviewImages({ fileId }) {
        return defHttp.request({
            method: 'POST',
            url: `/api/app/custom-file-descriptor/preview-images/${fileId}`,
        });
    }
}

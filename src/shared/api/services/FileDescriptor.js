import { defHttp } from "@/shared/utils/http/axios";
import { getToken } from "@/shared/utils/auth";

export const FileDescriptorService = {
  /**
   * 上传文件描述符
   * @param uploadParams - 上传参数，包括文件信息和额外属性
   * @returns 上传的响应
   */
  uploadFileDescriptor(uploadParams) {
    const { name, directoryId, overrideExisting, extraProperties, formData } = uploadParams;

    // 创建一个 FormData 对象，将文件及其相关参数添加进去
    const form = new FormData();
    if (formData?.File) form.append("File", formData.File);
    if (name) form.append("name", name);
    if (directoryId) form.append("directoryId", directoryId);
    if (overrideExisting !== undefined) form.append("overrideExisting", String(overrideExisting));
    if (extraProperties) {
      Object.keys(extraProperties).forEach(key => {
        form.append(`extraProperties[${key}]`, extraProperties[key]);
      });
    }

    return defHttp.request({
      method: "POST",
      url: `/api/app/custom-file-descriptor/upload`,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${getToken()}`,
      },
      data: form,
    });
  },
};

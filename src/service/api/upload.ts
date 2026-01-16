import { request } from '@/service/request';

/**
 * 上传文件
 *
 * @param file - 文件对象
 */
export function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  return request<{ url: string }>({
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    url: '/upload/file'
  });
}

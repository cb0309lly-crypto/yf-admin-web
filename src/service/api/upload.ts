import { request } from '@/service/request';

/**
 * 上传文件
 * @param file - 文件对象
 */
export function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  return request<{ url: string }>({
    url: '/upload/file',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

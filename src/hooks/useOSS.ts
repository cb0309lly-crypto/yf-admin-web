import { useState, useCallback } from 'react';
import { message } from 'antd';
import { uploadToOSS, validateFileType, validateFileSize, compressImage } from '@/utils/oss';
import { uploadConfig } from '@/config/oss';

export interface UseOSSOptions {
  onSuccess?: (url: string, fileName: string) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
  compress?: boolean;
}

export const useOSS = (options: UseOSSOptions = {}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = useCallback(async (file: File, folder?: string) => {
    const { onSuccess, onError, onProgress, compress = true } = options;

    try {
      // 验证文件类型
      if (!validateFileType(file, uploadConfig.allowedTypes)) {
        const errorMsg = `不支持的文件类型，请上传 ${uploadConfig.allowedTypes.join('、')} 格式的图片`;
        message.error(errorMsg);
        onError?.(errorMsg);
        return;
      }

      // 验证文件大小
      if (!validateFileSize(file, uploadConfig.maxSize)) {
        const errorMsg = `文件大小不能超过 ${Math.round(uploadConfig.maxSize / 1024 / 1024)}MB`;
        message.error(errorMsg);
        onError?.(errorMsg);
        return;
      }

      setUploading(true);
      setProgress(0);

      // 压缩图片（如果是图片且启用压缩）
      let fileToUpload = file;
      if (compress && file.type.startsWith('image/')) {
        try {
          fileToUpload = await compressImage(
            file,
            uploadConfig.compressQuality,
            uploadConfig.maxWidth
          );
        } catch (error) {
          console.warn('图片压缩失败，使用原图:', error);
        }
      }

      // 上传到OSS
      const result = await uploadToOSS(fileToUpload, {
        folder: folder || uploadConfig.folder,
        onProgress: (progressValue) => {
          setProgress(progressValue);
          onProgress?.(progressValue);
        },
      });

      message.success('文件上传成功');
      onSuccess?.(result.url, result.fileName);
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '上传失败';
      message.error(errorMsg);
      onError?.(errorMsg);
      throw error;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [options]);

  return {
    upload,
    uploading,
    progress,
  };
};

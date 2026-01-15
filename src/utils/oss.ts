import OSS from 'ali-oss';

// OSS配置接口
export interface OSSConfig {
  accessKeyId: string;
  accessKeySecret: string;
  bucket: string;
  region: string;
  secure?: boolean;
}

// 上传选项接口
export interface UploadOptions {
  fileName?: string;
  folder?: string;
  onProgress?: (progress: number) => void;
}

// OSS客户端实例
let ossClient: OSS | null = null;

// 初始化OSS客户端
export const initOSS = (config: OSSConfig) => {
  ossClient = new OSS({
    accessKeyId: config.accessKeyId,
    accessKeySecret: config.accessKeySecret,
    bucket: config.bucket,
    region: config.region,
    secure: config.secure ?? true
  });
  return ossClient;
};

// 获取OSS客户端
export const getOSSClient = () => {
  if (!ossClient) {
    throw new Error('OSS客户端未初始化，请先调用 initOSS 方法');
  }
  return ossClient;
};

// 生成唯一文件名
export const generateFileName = (originalName: string, folder?: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop() || '';
  const fileName = `${timestamp}_${random}.${extension}`;

  if (folder) {
    return `${folder}/${fileName}`;
  }
  return fileName;
};

// 上传文件到OSS
export const uploadToOSS = async (
  file: File,
  options: UploadOptions = {}
): Promise<{ fileName: string; url: string }> => {
  const client = getOSSClient();

  const { fileName, folder, onProgress } = options;
  const finalFileName = fileName || generateFileName(file.name, folder);

  try {
    const result = await client.put(finalFileName, file, {
      progress: (p: number) => {
        if (onProgress) {
          onProgress(Math.round(p * 100));
        }
      }
    });

    return {
      fileName: finalFileName,
      url: result.url
    };
  } catch (error) {
    console.error('OSS上传失败:', error);
    throw new Error(`文件上传失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
};

// 删除OSS文件
export const deleteFromOSS = async (fileName: string): Promise<void> => {
  const client = getOSSClient();

  try {
    await client.delete(fileName);
  } catch (error) {
    console.error('OSS删除失败:', error);
    throw new Error(`文件删除失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
};

// 检查文件类型
export const validateFileType = (
  file: File,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif']
): boolean => {
  return allowedTypes.includes(file.type);
};

// 检查文件大小
export const validateFileSize = (file: File, maxSize: number = 5 * 1024 * 1024): boolean => {
  return file.size <= maxSize;
};

// 压缩图片
export const compressImage = (file: File, quality: number = 0.8, maxWidth: number = 800): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // 计算压缩后的尺寸
      let { height, width } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // 绘制压缩后的图片
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        blob => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              lastModified: Date.now(),
              type: file.type
            });
            resolve(compressedFile);
          } else {
            reject(new Error('图片压缩失败'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => reject(new Error('图片加载失败'));
    img.src = URL.createObjectURL(file);
  });
};

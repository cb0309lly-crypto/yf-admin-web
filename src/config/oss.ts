import type { OSSConfig } from '@/utils/oss';

// OSS配置
export const ossConfig: OSSConfig = {
  accessKeyId: process.env.VITE_OSS_ACCESS_KEY_ID || '',
  accessKeySecret: process.env.VITE_OSS_ACCESS_KEY_SECRET || '',
  bucket: process.env.VITE_OSS_BUCKET || '',
  region: process.env.VITE_OSS_REGION || 'oss-cn-hangzhou',
  secure: true
};

// 上传配置
export const uploadConfig = {
  // 允许的文件类型
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  // 图片压缩质量
  compressQuality: 0.8,
  // 上传文件夹
  folder: 'products',
  // 最大文件大小 (5MB)
  maxSize: 5 * 1024 * 1024,
  // 最大宽度
  maxWidth: 800
};

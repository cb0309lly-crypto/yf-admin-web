/**
 * 解析数字，处理字符串转数字的情况
 * @param value 待转换的值
 * @returns 转换后的数字
 */
export function parseNumber(value: any): number {
  if (value === null || value === undefined) {
    return 0;
  }
  
  if (typeof value === 'number') {
    return value;
  }
  
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  
  return 0;
}

/**
 * 格式化价格显示
 * @param value 价格值
 * @param decimals 小数位数，默认2位
 * @returns 格式化后的价格字符串
 */
export function formatPrice(value: any, decimals: number = 2): string {
  const num = parseNumber(value);
  return `¥${num.toFixed(decimals)}`;
}

/**
 * 安全地计算两个数字的和
 * @param a 第一个数
 * @param b 第二个数
 * @returns 计算结果
 */
export function safeAdd(a: any, b: any): number {
  return parseNumber(a) + parseNumber(b);
}

/**
 * 安全地计算两个数字的乘积
 * @param a 第一个数
 * @param b 第二个数
 * @returns 计算结果
 */
export function safeMultiply(a: any, b: any): number {
  return parseNumber(a) * parseNumber(b);
}

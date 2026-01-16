export type PromotionType = 'bundle' | 'buy_one_get_one' | 'discount' | 'flash_sale' | 'free_shipping';
export type PromotionStatus = 'active' | 'cancelled' | 'draft' | 'ended' | 'paused';

export interface Promotion {
  applicableCategories?: string[];
  applicableProducts?: string[];
  bannerImage?: string;
  createdAt: string;
  description?: string;
  discountValue: number;
  endDate: string;
  isFeatured: boolean;
  maximumDiscount?: number;
  minimumAmount: number;
  name: string;
  no: string;
  priority: number;
  startDate: string;
  status: PromotionStatus;
  totalUsageLimit?: number;
  type: PromotionType;
  updatedAt: string;
  usageLimitPerUser: number;
  usedCount: number;
}

export interface PromotionListResponse {
  list: Promotion[];
  total: number;
}

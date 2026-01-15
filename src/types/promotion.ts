export type PromotionType = 'discount' | 'buy_one_get_one' | 'flash_sale' | 'bundle' | 'free_shipping';
export type PromotionStatus = 'draft' | 'active' | 'paused' | 'ended' | 'cancelled';

export interface Promotion {
  no: string;
  name: string;
  type: PromotionType;
  discountValue: number;
  status: PromotionStatus;
  startDate: string;
  endDate: string;
  description?: string;
  bannerImage?: string;
  applicableProducts?: string[];
  applicableCategories?: string[];
  minimumAmount: number;
  maximumDiscount?: number;
  usageLimitPerUser: number;
  totalUsageLimit?: number;
  usedCount: number;
  isFeatured: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface PromotionListResponse {
  list: Promotion[];
  total: number;
}


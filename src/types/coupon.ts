export type CouponType = 'discount' | 'fixed_amount' | 'free_shipping' | 'percentage';
export type CouponStatus = 'active' | 'inactive' | 'expired' | 'used';

export interface Coupon {
  no: string;
  name: string;
  userNo?: string;
  type: CouponType;
  value: number;
  minimumAmount: number;
  status: CouponStatus;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  code: string;
  description?: string;
  applicableProducts?: string[];
  applicableCategories?: string[];
  isGlobal: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CouponListResponse {
  list: Coupon[];
  total: number;
}


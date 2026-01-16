export type CouponType = 'discount' | 'fixed_amount' | 'free_shipping' | 'percentage';
export type CouponStatus = 'active' | 'expired' | 'inactive' | 'used';

export interface Coupon {
  applicableCategories?: string[];
  applicableProducts?: string[];
  code: string;
  createdAt: string;
  description?: string;
  isGlobal: boolean;
  minimumAmount: number;
  name: string;
  no: string;
  status: CouponStatus;
  type: CouponType;
  updatedAt: string;
  usageLimit: number;
  usedCount: number;
  userNo?: string;
  validFrom: string;
  validUntil: string;
  value: number;
}

export interface CouponListResponse {
  list: Coupon[];
  total: number;
}

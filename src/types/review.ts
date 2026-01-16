export type ReviewStatus = 'approved' | 'hidden' | 'pending' | 'rejected';

export interface Review {
  adminReply?: string;
  content: string;
  createdAt: string;
  helpfulCount: number;
  images?: string[];
  isVerifiedPurchase: boolean;
  name: string;
  no: string;
  orderNo?: string;
  productNo: string;
  rating: number;
  replyTime?: string;
  reviewTime: string;
  status: ReviewStatus;
  title?: string;
  updatedAt: string;
  userNo: string;
}

export interface ReviewListResponse {
  list: Review[];
  total: number;
}

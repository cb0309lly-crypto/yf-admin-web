export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'hidden';

export interface Review {
  no: string;
  name: string;
  userNo: string;
  productNo: string;
  orderNo?: string;
  rating: number;
  title?: string;
  content: string;
  status: ReviewStatus;
  reviewTime: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  images?: string[];
  adminReply?: string;
  replyTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewListResponse {
  list: Review[];
  total: number;
}


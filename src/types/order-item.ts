export interface OrderItem {
  /** 创建时间 */
  createdAt?: string;
  /** 折扣金额 */
  discountAmount: number;
  /** 最终价格 */
  finalPrice: number;
  /** 订单项ID */
  no: string;
  /** 备注 */
  notes?: string;
  /** 订单编号 */
  orderNo: string;
  /** 关联商品信息 */
  product?: {
    imgUrl?: string;
    name: string;
    no: string;
    price: number;
    specs?: string;
    unit?: string;
  };
  /** 商品编号 */
  productNo: string;
  /** 商品快照 */
  productSnapshot?: any;
  /** 商品数量 */
  quantity: number;
  /** 状态 */
  status: OrderItemStatus;
  /** 总价 */
  totalPrice: number;
  /** 商品单价 */
  unitPrice: number;
  /** 更新时间 */
  updatedAt?: string;
}

export enum OrderItemStatus {
  CANCELLED = 'cancelled',
  CONFIRMED = 'confirmed',
  DELIVERED = 'delivered',
  PENDING = 'pending',
  REFUNDED = 'refunded',
  SHIPPED = 'shipped'
}

export interface OrderItemListResponse {
  list: OrderItem[];
  total: number;
}

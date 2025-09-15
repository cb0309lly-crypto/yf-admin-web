export interface OrderItem {
  /** 订单项ID */
  no: string;
  /** 订单编号 */
  orderNo: string;
  /** 商品编号 */
  productNo: string;
  /** 商品数量 */
  quantity: number;
  /** 商品单价 */
  unitPrice: number;
  /** 总价 */
  totalPrice: number;
  /** 折扣金额 */
  discountAmount: number;
  /** 最终价格 */
  finalPrice: number;
  /** 状态 */
  status: OrderItemStatus;
  /** 备注 */
  notes?: string;
  /** 商品快照 */
  productSnapshot?: any;
  /** 创建时间 */
  createdAt?: string;
  /** 更新时间 */
  updatedAt?: string;
  /** 关联商品信息 */
  product?: {
    no: string;
    name: string;
    price: number;
    imgUrl?: string;
    specs?: string;
    unit?: string;
  };
}

export enum OrderItemStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export interface OrderItemListResponse {
  list: OrderItem[];
  total: number;
}

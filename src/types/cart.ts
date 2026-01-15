export interface Cart {
  /** 添加时间 */
  addedAt: string;
  /** 创建时间 */
  createdAt?: string;
  /** 购物车项ID */
  no: string;
  /** 商品编号 */
  productNo: string;
  /** 商品数量 */
  quantity: number;
  /** 是否选中 */
  selected: boolean;
  /** 状态 */
  status: CartItemStatus;
  /** 总价 */
  totalPrice: number;
  /** 商品单价 */
  unitPrice: number;
  /** 更新时间 */
  updatedAt?: string;
  /** 用户编号 */
  userNo: string;
}

export enum CartItemStatus {
  ACTIVE = 'active',
  PURCHASED = 'purchased',
  REMOVED = 'removed'
}

export interface CartListResponse {
  list: Cart[];
  total: number;
}

export interface UserCartResponse {
  itemCount: number;
  items: Cart[];
  totalPrice: number;
}

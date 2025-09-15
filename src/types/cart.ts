export interface Cart {
  /** 购物车项ID */
  no: string;
  /** 用户编号 */
  userNo: string;
  /** 商品编号 */
  productNo: string;
  /** 商品数量 */
  quantity: number;
  /** 商品单价 */
  unitPrice: number;
  /** 总价 */
  totalPrice: number;
  /** 状态 */
  status: CartItemStatus;
  /** 是否选中 */
  selected: boolean;
  /** 添加时间 */
  addedAt: string;
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

export enum CartItemStatus {
  ACTIVE = 'active',
  REMOVED = 'removed',
  PURCHASED = 'purchased'
}

export interface CartListResponse {
  list: Cart[];
  total: number;
}

export interface UserCartResponse {
  items: Cart[];
  totalPrice: number;
  itemCount: number;
}

export interface Order {
  /** 订单编号 */
  no: string;
  /** 用户编号 */
  userNo: string;
  /** 收货地址 */
  shipAddress?: string;
  /** 订单总额 */
  orderTotal?: number;
  /** 订单状态 */
  orderStatus: OrderStatus;
  /** 订单描述 */
  description?: string;
  /** 订单备注 */
  remark?: string;
  /** 操作员编号 */
  operatorNo?: string;
  /** 客户编号 */
  customerNo?: string;
  /** 商品编号 */
  productNo?: string;
  /** 物料编号 */
  materialNo?: string;
  /** 物流编号 */
  logisticsNo?: string;
  /** 创建时间 */
  createdAt?: string;
  /** 更新时间 */
  updatedAt?: string;
  /** 订单商品列表 */
  orderItems?: OrderItem[];
}

export enum OrderStatus {
  ORDERED = '已下单',
  UNPAY = '未付款',
  PAIED = '已付款',
  CANCELED = '已取消',
  DELIVERY = '已配送',
  UNKNOW = '异常单'
}

export interface OrderItem {
  /** 订单项ID */
  id: string;
  /** 商品编号 */
  productNo: string;
  /** 商品名称 */
  productName: string;
  /** 商品规格 */
  productSpecs?: string;
  /** 商品单价 */
  unitPrice: number;
  /** 购买数量 */
  quantity: number;
  /** 小计金额 */
  subtotal: number;
  /** 商品图片 */
  productImage?: string;
}

export interface OrderListResponse {
  list: Order[];
  total: number;
}

export interface OrderQueryParams {
  customerNo?: string;
  keyword?: string;
  operatorNo?: string;
  orderStatus?: string;
  page: number;
  pageSize: number;
  userNo?: string;
}

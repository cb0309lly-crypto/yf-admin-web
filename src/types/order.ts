export interface Order {
  /** 创建时间 */
  createdAt?: string;
  /** 客户编号 */
  customerNo?: string;
  /** 订单描述 */
  description?: string;
  /** 物流编号 */
  logisticsNo?: string;
  /** 物料编号 */
  materialNo?: string;
  /** 订单编号 */
  no: string;
  /** 操作员编号 */
  operatorNo?: string;
  /** 订单商品列表 */
  orderItems?: OrderItem[];
  /** 订单状态 */
  orderStatus: OrderStatus;
  /** 订单总额 */
  orderTotal?: number;
  /** 商品编号 */
  productNo?: string;
  /** 订单备注 */
  remark?: string;
  /** 收货地址 */
  shipAddress?: string;
  /** 更新时间 */
  updatedAt?: string;
  /** 用户编号 */
  userNo: string;
}

export enum OrderStatus {
  ORDERED = '已下单',
  PAIED = '已付款',
  CANCELED = '已取消',
  DELIVERY = '已配送',
  UNKNOW = '异常单',
  UNPAY = '未付款'
}

export interface OrderItem {
  /** 订单项ID */
  id: string;
  /** 商品图片 */
  productImage?: string;
  /** 商品名称 */
  productName: string;
  /** 商品编号 */
  productNo: string;
  /** 商品规格 */
  productSpecs?: string;
  /** 购买数量 */
  quantity: number;
  /** 小计金额 */
  subtotal: number;
  /** 商品单价 */
  unitPrice: number;
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

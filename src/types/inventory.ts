export interface Inventory {
  // 库存状态：正常、低库存、缺货、超量
  createTime?: string;
  // 商品图片（冗余字段，便于显示）
  currentStock: number;
  id?: string; // 库存单位
  location?: string; // 最小库存预警值
  maxStock: number; // 当前库存数量
  minStock: number; // 商品名称（冗余字段，便于显示）
  productImgUrl?: string; // 关联商品编号
  productName?: string;
  productNo: string;
  remark?: string; // 库存位置/仓库
  status: 'low' | 'normal' | 'out' | 'over';
  // 最大库存限制
  unit?: string;
  updateTime?: string; // 备注
}

export interface InventoryListResponse {
  list: Inventory[];
  total: number;
}

export interface InventoryOperation {
  // 操作前库存
  afterStock: number;
  // 操作数量
  beforeStock: number;
  // 操作原因
  createTime?: string;
  id?: string; // 操作后库存
  operator?: string;
  productNo: string; // 操作类型：入库、出库、调整
  quantity: number; // 操作人
  reason?: string;
  type: 'adjust' | 'in' | 'out';
}

export interface InventoryOperationListResponse {
  list: InventoryOperation[];
  total: number;
}

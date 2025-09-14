export interface Inventory {
  id?: string;
  productNo: string; // 关联商品编号
  productName?: string; // 商品名称（冗余字段，便于显示）
  productImgUrl?: string; // 商品图片（冗余字段，便于显示）
  currentStock: number; // 当前库存数量
  minStock: number; // 最小库存预警值
  maxStock: number; // 最大库存限制
  unit?: string; // 库存单位
  location?: string; // 库存位置/仓库
  status: 'normal' | 'low' | 'out' | 'over'; // 库存状态：正常、低库存、缺货、超量
  createTime?: string;
  updateTime?: string;
  remark?: string; // 备注
}

export interface InventoryListResponse {
  list: Inventory[];
  total: number;
}

export interface InventoryOperation {
  id?: string;
  productNo: string;
  type: 'in' | 'out' | 'adjust'; // 操作类型：入库、出库、调整
  quantity: number; // 操作数量
  beforeStock: number; // 操作前库存
  afterStock: number; // 操作后库存
  operator?: string; // 操作人
  reason?: string; // 操作原因
  createTime?: string;
}

export interface InventoryOperationListResponse {
  list: InventoryOperation[];
  total: number;
}

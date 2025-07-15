export interface Product {
  categoryNo?: string;
  companyNo?: string;
  createTime?: string;
  description?: string;
  imgUrl?: string;
  name: string;
  no: string;
  orderNo?: string;
  price?: number;
  specs?: string;
  status?: string;
  tag?: string;
  unit?: string;
  updateTime?: string;
}

export interface ProductListResponse {
  list: Product[];
  total: number;
}

// 店铺状态类型
export type StoreStatus = 'active' | 'paused' | 'renovating'

// 店员职位类型
export type StaffPosition = '店长' | '收银员' | '导购员' | '仓管员'

// 店员状态类型
export type StaffStatus = '在职' | '离职'

// 店员信息
export interface StoreStaff {
  name: string
  position: StaffPosition
  status?: StaffStatus
  entryTime?: string
  leaveTime?: string
  phone?: string
  createTime?: string
}

// 店铺基础信息
export interface Store {
  id: number
  name: string
  location: string
  status: StoreStatus
  username: string // 对应后端的loginId
  password: string
  manager: string
  phone: string
  staffList: StoreStaff[]
  createTime?: string
  updateTime?: string
}

// 店铺表单数据
export interface StoreForm {
  name: string
  location: string
  username: string // 对应后端的loginId
  password: string
  manager: string
  phone: string
  staffList: StoreStaff[]
  status: StoreStatus
}

// 创建店铺请求
export type CreateStoreRequest = StoreForm

// 更新店铺请求
export type UpdateStoreRequest = Partial<StoreForm>

// 店铺查询参数
export interface StoreQueryParams {
  keyword?: string
  status?: StoreStatus
  page?: number
  pageSize?: number
}

// 店铺统计数据
export interface StoreStats {
  totalStores: number
  totalStaff: number
  newStoresThisMonth: number
  operationRate: number
}

// 店铺响应数据
export interface StoreResponse {
  items: Store[]
  total: number
}

// 店铺库存信息
export interface StoreInventory {
  id: number
  storeId: number
  productId: number
  productName: string
  quantity: number
  unit: string
  warningThreshold: number
  lastCheckTime: string
  updateTime: string
}

// 创建店铺员工请求
export type CreateStaffRequest = Omit<StoreStaff, 'status' | 'leaveTime'>

// 更新店铺员工请求
export type UpdateStaffRequest = Partial<CreateStaffRequest>

// 店铺员工查询参数
export interface StoreStaffQueryParams {
  storeId?: number
  name?: string
  position?: StaffPosition
  status?: StaffStatus
  dateRange?: [string, string]
}

// 店铺库存查询参数
export interface StoreInventoryQueryParams {
  storeId?: number
  productId?: number
  productName?: string
  belowWarning?: boolean
}

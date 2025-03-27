import { request } from '../config'
import type {
  Store,
  StoreForm,
  StoreResponse,
  StoreQueryParams,
  StoreStaff,
  StoreInventory,
  CreateStoreRequest,
  UpdateStoreRequest,
  CreateStaffRequest,
  UpdateStaffRequest,
  StoreStaffQueryParams,
  StoreInventoryQueryParams,
  StoreStatus
} from '@/types/api/admin/store'
import type { ApiResponse, PaginationResponse, PaginationParams } from '@/types/api/common'
import type { Message, PageInfoShopView, ShopView } from '@/types/api/response'

/**
 * 将后端响应转换为前端所需格式
 */
function transformShopResponse(response: PageInfoShopView): PaginationResponse<Store> {
  // 检查响应对象是否存在
  if (!response) {
    console.warn('转换店铺响应数据：接收到空响应')
    return {
      total: 0,
      items: [],
      page: 1,
      pageSize: 10
    }
  }

  // 打印实际收到的响应数据结构，帮助调试
  console.log('后端返回的店铺数据:', JSON.stringify(response, null, 2))

  // 安全地访问可能不存在的属性
  return {
    total: response?.totalRecords || 0,
    items: (response?.records || [])
      .map(shop => {
        // 确保每个shop对象存在
        if (!shop) return null

        // 找到店长信息
        const managerUser = (shop.users || []).find(
          user => user.position === '店长' || user.manager === true
        )

        // 转换店员数据 - 只包含非店长店员
        const staffList = (shop.users || [])
          .filter(user => !(user.position === '店长' || user.manager === true))
          .map(user => ({
            name: user.name || '',
            position: (user.position || '导购员') as '店长' | '收银员' | '导购员' | '仓管员',
            status: '在职' as '在职' | '离职',
            entryTime: user.createTime,
            phone: user.phone || ''
          }))

        // 如果有店长，添加到店员列表的开头
        if (managerUser) {
          staffList.unshift({
            name: managerUser.name || '',
            position: '店长',
            status: '在职',
            entryTime: managerUser.createTime,
            phone: managerUser.phone || ''
          })
        }

        return {
          id: shop.id || 0,
          name: shop.name || '',
          location: shop.location || '',
          status: mapStatus(shop.status),
          username: shop.loginId || '',
          password: '',
          manager: managerUser?.name || '',
          phone: managerUser?.phone || '',
          staffList: staffList,
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString()
        }
      })
      .filter(Boolean) as Store[], // 过滤掉null值
    page: response?.currentPage || 1,
    pageSize: response?.pageSize || 10
  }
}

/**
 * 映射状态值 - 从后端格式映射到前端格式
 */
function mapStatus(status?: string | null): StoreStatus {
  if (!status) return 'active'

  try {
    if (status === '暂停营业' || status === '停用' || status.toLowerCase().includes('pause'))
      return 'paused'
    if (status === '装修中' || status.toLowerCase().includes('renovat')) return 'renovating'
    // 默认情况下返回active
    return 'active'
  } catch (error) {
    console.error('状态映射错误:', error)
    return 'active' // 发生错误时返回默认状态
  }
}

/**
 * 映射状态值 - 从前端格式映射到后端格式
 */
function mapToBackendStatus(status: StoreStatus): string {
  switch (status) {
    case 'paused':
      return '暂停营业'
    case 'renovating':
      return '装修中'
    case 'active':
    default:
      return '正常运营'
  }
}

export const storeApi = {
  // 店铺基础信息管理
  async getList(params: PaginationParams & StoreQueryParams) {
    try {
      // 转换参数格式以匹配后端API
      const apiParams = {
        pageNumber: params.page || 1,
        pageSize: params.pageSize || 10,
        keyword: params.keyword
      }

      console.log('请求店铺列表参数:', JSON.stringify(apiParams, null, 2))

      // 从Axios响应中提取data字段
      const response = await request.get('/shops', { params: apiParams })

      // 日志输出，帮助调试
      console.log('获取店铺列表原始响应:', JSON.stringify(response, null, 2))

      // 处理可能的嵌套数据结构
      let pageInfoData: PageInfoShopView

      if (response && typeof response === 'object') {
        // response可能已经是PageInfoShopView格式
        pageInfoData = response as unknown as PageInfoShopView
      } else {
        console.warn('店铺列表响应格式不符合预期, 使用空数据')
        pageInfoData = {
          currentPage: params.page,
          pageSize: params.pageSize,
          totalRecords: 0,
          totalPages: 0,
          records: []
        }
      }

      // 将数据转换为前端格式
      const transformedData = transformShopResponse(pageInfoData)
      console.log('转换后的店铺列表数据:', JSON.stringify(transformedData, null, 2))

      return {
        code: 200,
        message: '成功',
        data: transformedData
      }
    } catch (error) {
      console.error('获取店铺列表失败', error)
      // 返回错误信息而不是抛出错误
      return {
        code: 500,
        message: error instanceof Error ? error.message : '获取店铺列表失败',
        data: {
          total: 0,
          items: [],
          page: params.page || 1,
          pageSize: params.pageSize || 10
        }
      }
    }
  },

  // 获取店铺全局统计数据
  async getStatistics() {
    try {
      console.log('获取店铺统计数据')

      // 如果有统计API，可以直接调用
      // 示例: const response = await request.get('/shops/statistics')

      // 目前模拟统计数据（实际项目中应替换为真实API调用）
      // 获取店铺列表用于计算统计数据
      const listResponse = await this.getList({
        page: 1,
        pageSize: 1000 // 尝试获取所有店铺
      })

      if (listResponse.code === 200 && listResponse.data?.items) {
        const stores = listResponse.data.items

        // 计算店员总数
        const totalStaffCount = stores.reduce(
          (sum, store) => sum + (store.staffList?.length || 0),
          0
        )

        // 计算本月新增店铺数
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const newStoresThisMonth = stores.filter(store => {
          // 处理createTime可能为undefined的情况，提供默认日期
          const createTime = store.createTime ? new Date(store.createTime) : new Date(0)
          return createTime >= startOfMonth
        }).length

        // 计算各状态店铺数量
        const statusCounts = {
          active: 0,
          paused: 0,
          renovating: 0
        }

        stores.forEach(store => {
          if (store.status) {
            statusCounts[store.status]++
          }
        })

        return {
          code: 200,
          message: '成功',
          data: {
            totalStaffCount,
            newStoresThisMonth,
            statusCounts
          }
        }
      }

      throw new Error('获取统计数据失败')
    } catch (error) {
      console.error('获取店铺统计数据失败', error)
      return {
        code: 500,
        message: error instanceof Error ? error.message : '获取店铺统计数据失败',
        data: {
          totalStaffCount: 0,
          newStoresThisMonth: 0,
          statusCounts: {
            active: 0,
            paused: 0,
            renovating: 0
          }
        }
      }
    }
  },

  async getDetail(id: number) {
    try {
      console.log(`获取店铺详情: ID=${id}`)

      // 尝试从列表中获取，避免调用不存在的API
      const listResponse = await this.getList({
        page: 1,
        pageSize: 100
      })

      if (listResponse.code === 200 && listResponse.data?.items) {
        const store = listResponse.data.items.find(item => item.id === id)

        if (store) {
          console.log(`从列表中找到店铺详情: ID=${id}`)
          return {
            code: 200,
            message: '成功',
            data: store
          }
        }
      }

      throw new Error('未找到店铺信息')
    } catch (error) {
      console.error(`获取店铺详情失败: ID=${id}`, error)
      return {
        code: 500,
        message: error instanceof Error ? error.message : '获取店铺详情失败',
        data: null
      }
    }
  },

  async create(storeData: StoreForm) {
    try {
      console.log('原始店铺数据:', JSON.stringify(storeData, null, 2))

      // 转换店员信息为后端格式
      const staffUsers = storeData.staffList.map((staff: StoreStaff) => ({
        name: staff.name,
        position: staff.position,
        manager: false, // 普通员工
        phone: staff.phone || ''
      }))

      // 添加店长信息到用户列表
      const managerUser = {
        name: storeData.manager,
        position: '店长' as const,
        manager: true, // 标记为店长
        phone: storeData.phone
      }

      // 所有用户数据，店长在第一位
      const users = [managerUser, ...staffUsers]

      // 创建符合后端 API 格式的请求数据
      const shopView = {
        name: storeData.name,
        location: storeData.location,
        status: mapToBackendStatus(storeData.status), // 使用状态映射函数
        loginId: storeData.username,
        password: storeData.password,
        users
      }

      console.log('转换后的创建店铺请求数据:', JSON.stringify(shopView, null, 2))

      // 发送创建请求
      const response = await request.post('/shops', shopView)
      console.log('创建店铺响应:', JSON.stringify(response, null, 2))

      return {
        code: 200,
        message: '店铺创建成功',
        data: null
      }
    } catch (error) {
      console.error('创建店铺失败:', error)
      return {
        code: 500,
        message: error instanceof Error ? error.message : '创建店铺失败',
        data: null
      }
    }
  },

  async delete(id: number) {
    try {
      console.log(`准备删除店铺(ID=${id})`)

      // 发送删除请求
      const response = await request.delete(`/shops/${id}`)
      console.log(`删除店铺(ID=${id})响应:`, JSON.stringify(response, null, 2))

      return {
        code: 200,
        message: '店铺删除成功',
        data: null
      }
    } catch (error) {
      console.error(`删除店铺失败: ID=${id}`, error)
      return {
        code: 500,
        message: error instanceof Error ? error.message : '删除店铺失败',
        data: null
      }
    }
  },

  async update(id: number, storeData: Partial<StoreForm>) {
    try {
      console.log('更新店铺原始数据:', JSON.stringify(storeData, null, 2))

      // 先获取当前店铺信息，确保我们有完整的数据
      const currentShopRes = await this.getDetail(id)
      if (currentShopRes.code !== 200 || !currentShopRes.data) {
        throw new Error('获取店铺信息失败，无法更新')
      }

      const currentShop = currentShopRes.data

      // 合并现有数据和更新数据
      const mergedData = {
        ...currentShop,
        ...storeData
      }

      // 转换店员信息为后端格式
      const staffUsers = (mergedData.staffList || [])
        .filter(staff => staff.position !== '店长') // 确保店长不重复
        .map((staff: StoreStaff) => {
          // 创建店员数据对象
          const staffData = {
            id: (staff as any).id, // 保留已有店员的ID
            name: staff.name,
            position: staff.position,
            manager: false, // 普通员工
            phone: staff.phone || '',
            shopId: id
          }

          // 如果有createTime，保留原来的，否则添加当前时间
          if (staff.createTime) {
            staffData.createTime = staff.createTime
          } else {
            // 为新增店员添加创建时间
            staffData.createTime = new Date().toISOString()
          }

          return staffData
        })

      // 添加店长信息到用户列表
      const managerUser = mergedData.manager
        ? {
            id: (currentShop.staffList || []).find(s => s.position === '店长')?.id, // 保留店长ID
            name: mergedData.manager,
            position: '店长' as const,
            manager: true, // 标记为店长
            phone: mergedData.phone || '',
            shopId: id,
            // 为店长添加createTime，如果存在则使用现有的，否则使用当前时间
            createTime:
              (currentShop.staffList || []).find(s => s.position === '店长')?.createTime ||
              new Date().toISOString()
          }
        : null

      // 所有用户数据，店长在第一位
      const users = managerUser ? [managerUser, ...staffUsers] : staffUsers

      // 创建符合后端API格式的请求数据 - 确保字段顺序与后端期望一致
      const shopView: any = {
        id: id, // 确保包含ID字段
        name: mergedData.name,
        location: mergedData.location,
        status: mapToBackendStatus(mergedData.status),
        loginId: mergedData.username
      }

      // 密码在users之前添加，保持与curl成功请求一致的字段顺序
      if (storeData.password) {
        shopView.password = storeData.password
      } else {
        // 确保password字段存在，即使为空字符串
        shopView.password = ''
      }

      // 用户数据放在最后
      shopView.users = users

      console.log('转换后的更新店铺请求数据:', JSON.stringify(shopView, null, 2))

      // 发送更新请求，显式指定Content-Type
      const response = await request.put(`/shops/${id}`, shopView, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log('更新店铺响应:', JSON.stringify(response, null, 2))

      return {
        code: 200,
        message: '店铺更新成功',
        data: null
      }
    } catch (error) {
      console.error('更新店铺失败:', error)
      return {
        code: 500,
        message: error instanceof Error ? error.message : '更新店铺失败',
        data: null
      }
    }
  },

  // 店铺状态更新 - 根据实际后端API调整
  async updateStatus(id: number, status: StoreStatus) {
    try {
      console.log(`更新店铺(ID=${id})状态为:`, status)

      // 先获取当前店铺信息
      const currentShopRes = await this.getDetail(id)
      if (currentShopRes.code !== 200 || !currentShopRes.data) {
        throw new Error('获取店铺信息失败，无法更新状态')
      }

      const currentShop = currentShopRes.data

      // 创建更新请求数据
      // 注意：这里我们只更新状态，保留其他现有信息
      const shopView = {
        name: currentShop.name,
        location: currentShop.location,
        status: mapToBackendStatus(status),
        // 不传递密码，避免密码被重置
        loginId: currentShop.username,
        // 保持现有的员工信息
        users: (currentShop.staffList || []).map(staff => ({
          name: staff.name,
          position: staff.position,
          phone: staff.phone || '',
          manager: staff.position === '店长'
        }))
      }

      console.log('状态更新请求数据:', JSON.stringify(shopView, null, 2))

      // 发送更新请求
      const response = await request.put(`/shops/${id}`, shopView)
      console.log('状态更新响应:', JSON.stringify(response, null, 2))

      return {
        code: 200,
        message: '店铺状态更新成功',
        data: null
      }
    } catch (error) {
      console.error(`更新店铺状态失败: ID=${id}`, error)
      return {
        code: 500,
        message: error instanceof Error ? error.message : '更新店铺状态失败',
        data: null
      }
    }
  },

  // 以下API可能需要完全重写，取决于后端的实际API设计
  // 目前保持原有实现，但在实际使用时需要根据后端API调整

  // 店铺员工管理
  getStaffList(params: PaginationParams & StoreStaffQueryParams) {
    console.warn('此API需要根据后端接口调整')
    return request.get<ApiResponse<PaginationResponse<StoreStaff>>>('/admin/store-staff', {
      params
    })
  },

  getStaffDetail(id: number) {
    console.warn('此API需要根据后端接口调整')
    return request.get<ApiResponse<StoreStaff>>(`/admin/store-staff/${id}`)
  },

  createStaff(data: CreateStaffRequest) {
    console.warn('此API需要根据后端接口调整')
    return request.post<ApiResponse<StoreStaff>>('/admin/store-staff', data)
  },

  updateStaff(id: number, data: UpdateStaffRequest) {},

  deleteStaff(id: number) {
    console.warn('此API需要根据后端接口调整')
    return request.delete<ApiResponse<void>>(`/admin/store-staff/${id}`)
  },

  // 员工离职
  staffLeave(id: number, leaveTime: string, reason: string) {
    console.warn('此API需要根据后端接口调整')
    return request.post<ApiResponse<void>>(`/admin/store-staff/${id}/leave`, { leaveTime, reason })
  },

  // 店铺库存管理
  getInventoryList(params: PaginationParams & StoreInventoryQueryParams) {
    console.warn('此API需要根据后端接口调整')
    return request.get<ApiResponse<PaginationResponse<StoreInventory>>>('/admin/store-inventory', {
      params
    })
  },

  getInventoryDetail(storeId: number, productId: number) {
    console.warn('此API需要根据后端接口调整')
    return request.get<ApiResponse<StoreInventory>>(
      `/admin/store-inventory/${storeId}/${productId}`
    )
  },

  // 调整库存
  adjustInventory(storeId: number, productId: number, adjustment: number, reason: string) {
    console.warn('此API需要根据后端接口调整')
    return request.post<ApiResponse<StoreInventory>>(
      `/admin/store-inventory/${storeId}/${productId}/adjust`,
      {
        adjustment,
        reason
      }
    )
  },

  // 设置库存预警阈值
  setWarningThreshold(storeId: number, productId: number, threshold: number) {
    console.warn('此API需要根据后端接口调整')
    return request.post<ApiResponse<void>>(
      `/admin/store-inventory/${storeId}/${productId}/warning-threshold`,
      {
        threshold
      }
    )
  },

  // 库存盘点
  checkInventory(storeId: number, productId: number, actualQuantity: number, notes?: string) {
    console.warn('此API需要根据后端接口调整')
    return request.post<ApiResponse<StoreInventory>>(
      `/admin/store-inventory/${storeId}/${productId}/check`,
      {
        actualQuantity,
        notes
      }
    )
  }
}

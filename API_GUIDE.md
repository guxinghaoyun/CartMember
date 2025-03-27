# 智慧零售管理系统 API对接指南

## 后端API基本信息

- 后端API基础URL: `http://162.14.67.119:8090`
- Swagger文档: `http://162.14.67.119:8090/swagger-ui/index.html`

## 认证机制

### 登录流程

1. 登录API为`/api/login`，使用**GET查询参数**而非JSON Body

   ```bash
   # 正确示例
   POST /api/login?loginId=admin&password=passw0rd

   # 错误示例 (不要使用JSON body)
   POST /api/login
   {
     "loginId": "admin",
     "password": "passw0rd"
   }
   ```

2. 认证token通过`Authorization`响应头返回，而非响应体

   ```
   Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
   ```

3. 在后续请求中，需要在请求头中包含此token
   ```
   Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
   ```

### 前端认证配置

Axios配置中已处理token的存取:

- baseURL为`/api`，所有API路径无需重复添加`/api`前缀
- 请求拦截器自动添加Authorization头
- token存储在localStorage中

## 状态值映射

前端与后端使用不同的状态表示，需要进行映射：

| 前端状态   | 后端状态 |
| ---------- | -------- |
| active     | 正常运营 |
| paused     | 停用     |
| renovating | 装修中   |

示例：

```typescript
// 前端到后端的映射
function mapToBackendStatus(status: string): string {
  switch (status) {
    case 'active':
      return '正常运营'
    case 'paused':
      return '停用'
    case 'renovating':
      return '装修中'
    default:
      return '正常运营'
  }
}

// 后端到前端的映射
function mapToFrontendStatus(status?: string): string {
  if (status === '停用') return 'paused'
  if (status === '装修中') return 'renovating'
  return 'active' // 默认为active
}
```

## 常见错误处理

错误响应格式为：

```json
{
  "code": "错误代码",
  "type": "错误类型(E表示错误)",
  "data": "错误详细信息"
}
```

常见错误及解决方案：

- `User not exist!` - 检查登录用户名是否正确
- `Token is empty!` - 检查是否正确传递了Authorization头
- `Invalid shop status!` - 确保使用正确的店铺状态值(如"正常运营")

## 数据转换

后端分页数据结构为：

```json
{
  "currentPage": 1,
  "pageSize": 10,
  "totalRecords": 100,
  "totalPages": 10,
  "records": [...]
}
```

需要转换为前端使用的格式：

```json
{
  "total": 100,
  "items": [...],
  "page": 1,
  "pageSize": 10
}
```

## 主要API接口示例

### 店铺管理

```typescript
// 获取店铺列表
GET /shops?pageNumber=1&pageSize=10

// 获取单个店铺
GET /shops/{id}

// 添加店铺
POST /shops
{
  "name": "店铺名称",
  "location": "地址",
  "loginId": "登录账号",
  "password": "密码",
  "status": "正常运营"
}

// 更新店铺
PUT /shops/{id}
{
  "name": "店铺名称",
  "location": "地址",
  "loginId": "登录账号",
  "password": "密码",
  "status": "正常运营"
}

// 删除店铺
DELETE /shops/{id}
```

## 注意事项

1. 在对接过程中始终参考Swagger文档以获取最新的接口定义
2. 某些接口可能使用查询参数，而非请求体，请仔细检查
3. 确保状态值映射正确，这是常见错误来源
4. 时间字段格式需要注意兼容性

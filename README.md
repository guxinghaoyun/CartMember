# 零售管理系统

这是一个基于Vue 3的现代零售管理系统，提供完整的店铺管理、会员管理、商品管理、订单处理和数据分析功能。系统分为管理端和用户端两个主要模块，满足不同角色的业务需求。

## 功能特性

### 管理端

- **门店管理**：创建、编辑和管理门店信息
- **卡片管理**：会员卡和充值卡的创建与管理
- **商品管理**：商品信息维护、库存管理
- **会员管理**：会员信息管理、会员级别设置
- **数据统计**：销售数据、会员数据分析和可视化
- **系统日志**：操作日志记录与查询

### 用户端

- **会员中心**：个人信息管理、积分与余额查询
- **购物功能**：商品浏览、加入购物车、结算
- **充值功能**：账户充值和充值记录查询
- **取货功能**：线上下单，门店取货
- **个人数据**：消费统计与分析

## 技术栈

- **前端框架**：Vue 3 + TypeScript
- **构建工具**：Vite
- **UI组件**：Element Plus
- **CSS框架**：TailwindCSS
- **状态管理**：Pinia
- **路由管理**：Vue Router
- **HTTP客户端**：Axios
- **图表库**：ECharts
- **图标库**：FontAwesome

## 环境要求

- Node.js 16.x 或更高版本
- npm 7.x 或更高版本

## 安装与运行

### 开发环境

1. 克隆代码库

```bash
git clone [仓库URL]
cd retail-management
```

2. 安装依赖

```bash
npm install
```

3. 启动开发服务器

```bash
npm run dev
```

4. 在浏览器中访问

```
http://localhost:5173
```

### 生产环境构建

1. 构建生产版本

```bash
npm run build
```

2. 预览生产构建

```bash
npm run preview
```

### Docker部署

项目提供了Docker支持，可以使用以下命令构建和运行容器：

```bash
# 构建Docker镜像
docker build -t retail-management .

# 运行容器
docker run -d -p 80:80 retail-management
```

## 项目结构

```
retail-management/
├── public/              # 静态资源
├── src/                 # 源代码
│   ├── api/             # API接口
│   ├── assets/          # 资源文件
│   ├── components/      # 公共组件
│   ├── router/          # 路由配置
│   ├── views/           # 页面组件
│   │   ├── admin/       # 管理端页面
│   │   └── user/        # 用户端页面
│   ├── plugins/         # 插件配置
│   ├── utils/           # 工具函数
│   ├── types/           # TypeScript类型定义
│   ├── App.vue          # 根组件
│   └── main.ts          # 入口文件
├── Dockerfile           # Docker配置
├── nginx.conf           # Nginx配置
└── vite.config.ts       # Vite配置
```

## 开发指南

### 推荐的IDE设置

推荐使用Visual Studio Code进行开发，并安装以下插件：

- Volar (Vue Language Features)
- TypeScript Vue Plugin
- ESLint
- Prettier

### 代码规范

项目使用ESLint和Prettier进行代码规范检查和格式化：

```bash
# 检查代码规范
npm run lint

# 格式化代码
npm run format
```

## 许可证

[添加适当的许可证信息]

## 贡献指南

[添加贡献指南信息]

## 联系方式

[添加联系方式信息]

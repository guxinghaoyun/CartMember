// 表单验证规则类型
export interface FormRules {
  [key: string]: {
    required?: boolean
    message?: string
    trigger?: string | string[]
    min?: number
    max?: number
    pattern?: RegExp
  }[]
}

// 日期快捷选项类型
export interface DateShortcut {
  text: string
  value: () => [Date, Date]
}

// 表格列配置类型
export interface TableColumn {
  key: string
  label: string
  class?: string
  width?: number | string
  sortable?: boolean
  fixed?: boolean | 'left' | 'right'
}

// 统计卡片类型
export interface StatCardProps {
  icon: string
  title: string
  value: string | number
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red'
  trend?: 'up' | 'down' | 'none'
  subValue?: string
  subLabel?: string
} 
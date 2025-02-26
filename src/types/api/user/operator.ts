export interface Operator {
    id: number
    name: string
    role: string
  }
  
  export interface OperatorQueryParams {
    storeId?: number
    role?: string
    keyword?: string
  }
  
  export interface OperatorResponse {
    operators: Operator[]
    total: number
  }
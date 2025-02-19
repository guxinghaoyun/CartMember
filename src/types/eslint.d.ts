declare module '@vue/eslint-config-typescript' {
  export const defineConfigWithVueTs: any
  export const vueTsConfigs: any
  const config: any
  export default config
}

declare module '@vue/eslint-config-prettier/skip-formatting' {
  const config: any
  export default config
}

// 添加其他可能需要的类型声明
declare module 'eslint-define-config'
declare module '@rushstack/eslint-patch' 
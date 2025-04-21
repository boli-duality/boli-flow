// 特性检测 + 动态加载
export default async function loadPolyfills() {
  if (typeof AbortController == 'undefined') {
    // 动态导入 Polyfill 文件
    await import('abortcontroller-polyfill/dist/abortcontroller-polyfill-only')
    console.log('AbortController Polyfill 已动态加载')
  }
}

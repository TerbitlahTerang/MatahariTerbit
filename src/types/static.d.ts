/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module '*.webp'
declare module '*.css'
declare module '*.png'

declare module '*.md' {
  const ref: { body: string }
  export default ref
}

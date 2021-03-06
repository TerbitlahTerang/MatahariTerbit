declare module '*.svg' {
  const ref: React.ForwardRefRenderFunction<SVGSVGElement, React.SVGAttributes<SVGSVGElement>>
  export default ref
}

declare module '*.webp'
declare module '*.css'
declare module '*.png'

declare module '*.md' {
  const ref: { body: string }
  export default ref
}

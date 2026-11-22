import type { Plugin } from 'vite'
import { readFileSync } from 'fs'
import { marked } from 'marked'
import fm from 'front-matter'

// Mirrors the output shape of the snowpack-plugin-markdown package this replaces:
// { ...frontMatterAttributes, markdown: rawBody, body: renderedHtml }
export function markdown(): Plugin {
  return {
    name: 'markdown-plugin',
    transform(code, id) {
      if (!id.endsWith('.md')) return
      const { attributes, body } = fm(readFileSync(id, 'utf-8'))
      const result = { ...(attributes as object), markdown: body, body: marked.parse(body) }
      return `export default ${JSON.stringify(result)}`
    }
  }
}

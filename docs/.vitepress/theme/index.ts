
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

const theme: Theme = {
  extends: DefaultTheme,

  enhanceApp({ app }) {
    if (typeof window !== 'undefined') {
      import('@google/model-viewer')
    }
  }
}

export default theme

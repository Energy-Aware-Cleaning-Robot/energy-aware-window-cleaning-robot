
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

import RobotCADViewer from './components/RobotCADViewer.vue'

export default {
  extends: DefaultTheme,

  enhanceApp({ app }) {
    app.component('RobotCADViewer', RobotCADViewer)
  }
} satisfies Theme

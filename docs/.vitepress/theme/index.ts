import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import RobotCADViewer from './components/RobotCADViewer.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('RobotCADViewer', RobotCADViewer)
  }
} satisfies Theme
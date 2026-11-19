import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import RobotCADViewer from './components/RobotCADViewer.vue'
import ResearcherProfile from './components/ResearcherProfile.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('RobotCADViewer', RobotCADViewer)
    app.component('ResearcherProfile', ResearcherProfile)
  }
} satisfies Theme


import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Energy-Aware Window Cleaning Robot',

  description:
    'Energy-efficient coverage path planning and control for a low-cost window cleaning robot',

  base: '/energy-aware-window-cleaning-robot/',

  cleanUrls: true,

  themeConfig: {

    // =========================
    // TOP NAVIGATION BAR
    // =========================

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Research', link: '/research/' },
      { text: 'Robot Design', link: '/design/' },
      { text: 'Software', link: '/software/' },
      { text: 'Results', link: '/results/' },
      { text: 'Development', link: '/development/' }
    ],

    // =========================
    // LEFT SIDEBAR NAVIGATION
    // =========================

    sidebar: {

      // RESEARCH
      '/research/': [
        {
          text: 'Research',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/research/' },
            { text: 'Methodology', link: '/research/methodology' }
          ]
        }
      ],

      // ROBOT DESIGN
      '/design/': [
        {
          text: 'Robot Design',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/design/' },
            { text: 'Mechanical Design', link: '/design/mechanical' },
            { text: 'Electrical Design', link: '/design/electrical' },
            { text: 'Suction System', link: '/design/suction' }
          ]
        }
      ],

      // SOFTWARE
      '/software/': [
        {
          text: 'Software Development',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/software/' },
            { text: 'Energy Model', link: '/software/energy-model' },
            { text: 'CPP Algorithms', link: '/software/cpp' },
            { text: 'Simulation', link: '/software/simulation' }
          ]
        }
      ],

      // RESULTS
      '/results/': [
        {
          text: 'Results & Analysis',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/results/' }
          ]
        }
      ],

      // DEVELOPMENT
      '/development/': [
        {
          text: 'Project Development',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/development/' }
          ]
        }
      ]
    },

    // =========================
    // GITHUB REPOSITORY
    // =========================

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/bryannrj/energy-aware-window-cleaning-robot'
      }
    ],

    // =========================
    // SEARCH
    // =========================

    search: {
      provider: 'local'
    },

    // =========================
    // FOOTER
    // =========================

    footer: {
      message: 'ME4101A Final Year Project',
      copyright: 'Energy-Aware Window Cleaning Robot'
    },

    // =========================
    // PAGE NAVIGATION
    // =========================

    docFooter: {
      prev: 'Previous Page',
      next: 'Next Page'
    },

    outline: {
      level: [2, 3],
      label: 'On this page'
    }
  }
})

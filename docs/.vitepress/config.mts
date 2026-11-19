import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Energy-Aware Window Cleaning Robot',
  description: 'Energy-efficient coverage path planning and control for a low-cost window-cleaning robot',
  base: '/energy-aware-window-cleaning-robot/',
  cleanUrls: true,
  appearance: false,

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Research', link: '/research/' },
      { text: 'Robot Design', link: '/design/' },
      { text: 'Software', link: '/software/' },
      { text: 'Results', link: '/results/' },
      { text: 'Development', link: '/development/' },
      { text: 'Meet the Researcher', link: '/team/' }
    ],

    sidebar: {
      '/research/': [
        {
          text: 'Research & Literature Review',
          collapsed: false,
          items: [
            { text: 'Introduction & Objectives', link: '/research/' },
            { text: 'Literature Review', link: '/research/literature-review' },
            { text: 'Research Gap', link: '/research/research-gap' },
            { text: 'Proposed Methodology', link: '/research/methodology' }
          ]
        }
      ],
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
      '/results/': [
        {
          text: 'Results & Analysis',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/results/' }
          ]
        }
      ],
      '/development/': [
        {
          text: 'Project Development',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/development/' }
          ]
        }
      ],
      '/team/': [
        {
          text: 'Meet the Researcher',
          collapsed: false,
          items: [
            { text: 'Researcher Profile', link: '/team/' }
          ]
        }
      ]
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/Energy-Aware-Cleaning-Robot/energy-aware-window-cleaning-robot'
      }
    ],

    search: { provider: 'local' },

    footer: {
      message: 'ME4101A Final Year Project',
      copyright: 'Energy-Aware Window Cleaning Robot'
    },

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

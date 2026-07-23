import { defineConfig } from 'vitepress'

// 尼看文档 - VitePress 配置
// 温暖、干净、富有诗意的文档站点
export default defineConfig({
  title: '尼看',
  description: '一个安静的角落，记录AI、日记、编程与短句',
  lastUpdated: true,
  cleanUrls: true,

  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600;9..144,800&family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
        rel: 'stylesheet'
      }
    ],
    ['meta', { name: 'theme-color', content: '#f7f1e8' }]
  ],

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: false
  },

  themeConfig: {
    outline: {
      level: [2, 3],
      label: '本页导览'
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    nav: [
      { text: '首页', link: '/' },
      { text: 'AI', link: '/ai/' },
      { text: '日记', link: '/diary/' },
      { text: '编程', link: '/coding/' },
      { text: '短句', link: '/phrases/' }
    ],

    sidebar: {
      '/ai/': [
        {
          text: '人工智能',
          items: [
            { text: '概览', link: '/ai/' },
            { text: '模型笔记', link: '/ai/models' },
            { text: '提示词工程', link: '/ai/prompts' }
          ]
        }
      ],
      '/diary/': [
        {
          text: '日记',
          items: [
            { text: '概览', link: '/diary/' },
            { text: '生活随笔', link: '/diary/life' },
            {text: '2026随记', link: '/diary/2026' }
          ]
        }
      ],
      '/coding/': [
        {
          text: '编程',
          items: [
            { text: '概览', link: '/coding/' },
            { text: '前端', link: '/coding/frontend' },
            { text: '后端', link: '/coding/backend' }
          ]
        }
      ],
      '/phrases/': [
        {
          text: '短句',
          items: [
            { text: '概览', link: '/phrases/' },
            { text: '收藏', link: '/phrases/collection' }
          ]
        }
      ]
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com' }],

    footer: {
      message: '以代码与文字，安放日常。',
      copyright: '© 2026 尼看文档'
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换'
            }
          }
        }
      }
    }
  }
})

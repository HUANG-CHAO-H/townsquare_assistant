import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import banner from 'vite-plugin-banner'

const bannerString = `
// ==UserScript==
// @name         血染钟楼(说书人)助手
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  向https://www.imdodo.com/tools/clocktower/页面注入一些JavaScript代码，来帮助说书人完成一些自动化操作，让说书人能够更加高效的工作
// @author       huangchao.hello
// @match        https://www.imdodo.com/tools/clocktower/
// @require      https://unpkg.com/react@18/umd/react.production.min.js
// @require      https://unpkg.com/react-dom@18/umd/react-dom.production.min.js
// @require      https://unpkg.com/@douyinfe/semi-ui@2.17.1/dist/umd/semi-ui.min.js
// @require      https://unpkg.com/@douyinfe/semi-icons@2.17.1/dist/umd/semi-icons.min.js
// @require      https://unpkg.com/@douyinfe/semi-illustrations@2.15.0/dist/umd/semi-illustrations.min.js
// @icon         <$ICON$>
// ==/UserScript==
`

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), banner(bannerString)],
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.tsx'),
      name: 'Assistant',
      fileName: () => '血染钟楼(说书人)助手.js',
      formats: ['umd']
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['react', 'react-dom', "@douyinfe/semi-ui", "@douyinfe/semi-icons", "@douyinfe/SemiIllustrations"],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          "@douyinfe/semi-ui": "SemiUI",
          "@douyinfe/semi-icons": "SemiIcons",
          "@douyinfe/SemiIllustrations": "SemiIllustrations",
        }
      }
    }
  }
})

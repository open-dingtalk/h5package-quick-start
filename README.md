# h5package-quick-start

H5离线包快速示例


## 初始化项目

```javascript

npm install

```

## 启动项目

```javascript
npm start
```

## 工程目录

```html

├── README.md
├── localresource.json // H5离线包配置文件
├── package.json
├── postcss.config.js
├── src
│   ├── pages
│   │   └── home
│   │       ├── audio.tsx // 音频示例
│   │       ├── form.tsx // 表单示例
│   │       ├── image.tsx // 图片示例
│   │       ├── index.less
│   │       ├── index.tpl // 页面HTML模板
│   │       ├── index.tsx // 页面JS入口
│   │       ├── navbar.tsx
│   │       ├── scan.tsx // 扫码示例
│   │       └── storage.tsx // 缓存示例
│   └── utils // 项目级基础工具函数
├── tailwind.config.js
├── tsconfig.json
├── webpack
│   ├── config
│   │   ├── webpack.base.config.js // 基础配置, 包含 babel、plugins 等
│   │   ├── webpack.dev.config.js // 开发环境配置, 如 devServer、mock
│   │   └── webpack.prod.config.js // 打包配置, 主要用于读取 DEF 构建环境
│   └── utils
│       ├── getPublicPath.js // 获取 DEF 构建 publicPath
│       ├── pageList.js // 工程页面列表
│       └── rootPath.js // 获取目前相对路径


```


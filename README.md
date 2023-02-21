# h5package-quick-start

钉钉H5离线包快速示例。
本项目包含一些常见的弱网离线场景可以使用的能力示例。并且使用 [dingtalk-h5package-opensdk](https://www.npmjs.com/package/dingtalk-h5package-opensdk) 进行离线包打包和上传操作。


## 初始化项目

```javascript

npm install
```

## 启动项目

```javascript
npm start
```

## H5离线包操作

### 离线包配置文件(localresource.json)准备

在离线包配置文件 ```localresource.json``` 中，输入 ```miniAppId```、```accessToken```。获取方式分别如下：

***miniAppId***: 离线包ID。在开发者后台***应用详情***--***版本管理与发布***--***离线包面板*** 中获取。


### 本地打包


执行以下命令，在本地输出离线包。

```javascript

npm run pack-h5package
```

### 打包&&上传

执行以下命令，自动打包并上传离线包。
***注意***：上传动作会调用开放平台OpenApi，在使用前需要在 localresource.json 中正确的配置 miniAppId、accessToken，获取方式如下：
***miniAppId***: 离线包ID。在开发者后台“***应用详情***”--“***版本管理与发布***”--“***离线包面板***” 中获取。
***accessToken***: 访问OpenApi时依赖的鉴权accessToken。获取方式参考：[Api Token](https://open.dingtalk.com/document/orgapp/used-to-obtain-the-application-authorization-without-api-token)。


```javascript

npm run deploy-h5package
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
├── webpack.config.js // webpack打包配置


```


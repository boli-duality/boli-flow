import { Configuration } from 'electron-builder'

const config: Configuration = {
  productName: 'BoliFlow', //项目名 这也是生成的exe文件的前缀名
  // appId: 'com.leon.xxxxx', //包名
  // copyright: 'xxxx', //版权  信息
  asar: true,
  // directories: {
  //   // 输出文件夹
  //   output: 'dist',
  //   buildResources: 'build',
  // },
  nsis: {
    oneClick: false, // 是否一键安装
    allowElevation: true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
    allowToChangeInstallationDirectory: true, // 允许修改安装目录
    installerIcon: 'build/public/favicon.ico', // 安装图标
    uninstallerIcon: 'build/public/favicon.ico', //卸载图标
    installerHeaderIcon: 'build/public/favicon.ico', // 安装时头部图标
    createDesktopShortcut: true, // 创建桌面图标
    createStartMenuShortcut: true, // 创建开始菜单图标
    shortcutName: 'BoliFlow', // 图标名称
    // include: 'build/script/installer.nsh', // 包含的自定义nsis脚本
  },
  // publish: [
  //   {
  //     provider: 'generic', // 服务器提供商 也可以是GitHub等等
  //     url: 'http://xxxxx/', // 服务器地址
  //   },
  // ],
  files: [
    {
      from: 'build',
      to: '.', // 平铺到 resources/app 目录
    },
  ],
  // dmg: {
  //   contents: [
  //     {
  //       x: 410,
  //       y: 150,
  //       type: 'link',
  //       path: '/Applications',
  //     },
  //     {
  //       x: 130,
  //       y: 150,
  //       type: 'file',
  //     },
  //   ],
  // },
  // mac: {
  //   icon: 'build/icons/icon.icns',
  // },
  win: {
    icon: 'build/public/favicon.ico',
    target: [
      {
        target: 'nsis',
        arch: ['x64'],
      },
    ],
    // requestedExecutionLevel: 'requireAdministrator', // 需要管理员权限
  },
  // linux: {
  //   icon: 'build/icons',
  // },
}

export default config

// 菜单 侧边栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '会员管理',
    icon: 'folder-o',
    children: [
      { path: '/page1', title: '会员列表' },
      { path: '/page2', title: '商品列表' },
      { path: '/page3', title: '消费列表' },
      { path: '/page4', title: '微信未绑定会员账户列表' },
    ]
  }
]

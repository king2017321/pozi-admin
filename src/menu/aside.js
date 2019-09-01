// 菜单 侧边栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '会员管理',
    icon: 'folder-o',
    children: [
      { path: '/page1', title: '会员列表' },
      { path: '/page4', title: '微信未绑定会员账户列表' },
    ]
  },
  {
    title: '消费管理',
    icon: 'folder-o',
    children: [
      { path: '/page3', title: '消费列表' },
      { path: '/page9', title: '活动报名' },
      { path: '/page10', title: '发型师预约' },
    ]
  },
  {
    title: '店铺管理',
    icon: 'folder-o',
    children: [
      { path: '/page5', title: '首页设置' },
      { path: '/page2', title: '商品列表' },
      { path: '/page7', title: '活动列表' },
      { path: '/page8', title: '发型师列表' },
    ]
  }
]

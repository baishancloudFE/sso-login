import React from 'react'
import { Layout, Menu, Icon, Popconfirm, Row, Col, Button } from 'igroot'
import { Route, Router, Link } from 'react-router-dom'
import createHashHistory from 'history/createHashHistory'
import PropTypes from 'prop-types'
import { logout, getLocalStorage, toggleFullScreen } from '../function'
import './ContainerLayout.scss'

const { SubMenu, Item } = Menu
const { Header, Content, Sider } = Layout
const hashHistory = createHashHistory()

export class ContainerLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedKeys: [],
      openKeys: [],
      collapsed: false,
    }
  }

  componentWillMount() {
    const menus = getLocalStorage('menu')
    let route   // 初始得到的路由信息
    let urlPath // 最终要放进浏览器的路由地址

    const initialRoute = getLocalStorage('currentRoute')
    if (initialRoute) {// token重新获取后在此进入页面，localStorage中保存有一个之前的路由
      route = initialRoute
      localStorage.removeItem('currentRoute')
    } else {
      const { location: { hash } } = window
      route = hash.replace('#', "")
    }

    let selectedKey, openKey
    // 默认路径如果为／，则设置第一个叶子菜单为默认路由
    if (!route || route === '/') {
      const firstChildMenu = this.getFlatMenus(menus[0])[0]
      openKey = menus[0].key
      selectedKey = firstChildMenu ? firstChildMenu.key : openKey
      urlPath = firstChildMenu ? firstChildMenu.to : open
    } else {// 用户手动输入一个路由
      urlPath = route
      let menu = this.searchMenuByPath(menus, route)
      if (!!menu) {
        const parentMenu = this.searchParentMenu(menu, menus)
        selectedKey = menu.key
        openKey = parentMenu ? parentMenu.key : selectedKey
      }// 如果不存在说明用户输入的路径有误，或者没有权限，则进入平台自定义的404路由
    }

    window.location.hash = urlPath

    this.setState({
      openKeys: [openKey],
      selectedKeys: [selectedKey]
    })

    this.historyListen(menus)
  }

  render() {
    const { selectedKeys, collapsed, openKeys } = this.state
    const { apiDomain, logo, appName } = this.props
    const menus = getLocalStorage('menu')
    console.log('openKeys', openKeys, 'selectedKeys', selectedKeys)
    return (
      <Router history={hashHistory}>
        <Layout style={{ height: '100%' }} id='page'>
          <Sider
            id="sider"
            trigger={null}
            collapsible
            collapsed={collapsed}>
            <div className="logo" key="logo">
              {
                logo ? <img src={logo} alt="logo" /> : <span className="logo-area" />
              }
              <h1>{appName}</h1>
            </div>
            <Menu
              theme='dark'
              mode='inline'
              openKeys={openKeys}
              onOpenChange={this.handleOpenChange}
              selectedKeys={selectedKeys}
              style={{ padding: '16px 0', width: '100%' }}
            >
              {
                this.renderMenu(menus)
              }
            </Menu>
          </Sider>
          <Layout>
            <Header className='header'>
              <Icon
                className="trigger"
                type={collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.onCollapse}
              />
              <span style={{
                display: 'inline-block',
                float: 'right',
                height: '100%',
                cursor: 'pointer',
                marginRight: 15,
                fontSize: 16
              }}>
                <Button icon="arrows-alt" style={{ marginRight: 32 }} onClick={toggleFullScreen}>全屏</Button>
                <span style={{ marginRight: 12 }}>{JSON.parse(localStorage.getItem('cname')) || '未登录'}</span>
                <Popconfirm title='确定注销当前账号吗?' onConfirm={() => logout(apiDomain)}>
                  <Icon type='logout' style={{ display: localStorage.getItem('cname') ? 'inline-block' : 'none' }} />
                </Popconfirm>
              </span>
            </Header>
            <Content style={{ margin: '12px 12px 0', height: '100%' }}>
              {this.props.children}
            </Content>
          </Layout>
        </Layout>
      </Router >
    )
  }

  // 处理父级菜单展开
  handleOpenChange = (openKeys) => {
    this.setState({
      openKeys: [openKeys[openKeys.length - 1]]
    })
  }

  // 监听浏览器地址栏变化，并联动菜单的选中状态
  historyListen = (menus) => {
    hashHistory.listen((location) => {
      let currentMenu = this.searchMenuByPath(menus, location.pathname)
      let parentMenu = this.searchParentMenu(currentMenu, menus)

      if (!!currentMenu && !!parentMenu && currentMenu.key !== this.state.selectedKeys[0]) {
        this.setState({
          selectedKeys: [currentMenu.key],
          openKeys: [parentMenu.key]
        })
      }
    })
  }

  // 渲染菜单
  renderMenu = (menus = []) => {
    return menus.map(item => {
      if (!item.subs)
        return (
          <Item key={item.key}>
            <Link to={item.to}>
              {
                item.iconType ? <Icon type={item.iconType} /> : null
              }
              <span>{item.name}</span>
            </Link>
          </Item>
        )
      else
        return (
          <SubMenu
            key={item.key}
            title={<span><Icon type={item.iconType} /><span>{item.name}</span></span>}
          >
            {
              item.subs.map(sub => (
                <Item key={sub.key}>
                  <Link to={sub.to}>
                    {
                      sub.iconType ? <Icon type={sub.iconType} /> : null
                    }
                    <span>{sub.name}</span>
                  </Link>
                </Item>
              ))
            }
          </SubMenu>
        )
    })
  }

  onCollapse = () => {
    const collapsed = !this.state.collapsed
    this.setState({
      collapsed,
    })
  }

  // 将所有菜单平铺
  getFlatMenus = (menu) => {
    let res = []
    if (!!menu.subs && menu.subs.length > 0) {
      menu.subs.forEach(sub => {
        res = [...res, ...this.getFlatMenus(sub)]
      })
    } else {
      res.push(menu)
    }
    return res
  }

  // 获取某个菜单的最上级菜单
  searchParentMenu = (menu, menus) => {
    let res = []
    menus.forEach(item => {
      const childMenus = this.getFlatMenus(item)
      if (childMenus.some(child => child.to === menu.to)) {
        res.push(item)
      }
    })
    return res[0]
  }

  // 根据路径名过滤出菜单
  searchMenuByPath = (allMenus, pathname) => {
    let res
    allMenus.forEach(menu => {
      if (menu.to === pathname) {
        res = menu
      } else if (!res && menu.subs && menu.subs.length > 0) {
        const childRes = this.searchMenuByPath(menu.subs, pathname)
        if (childRes) {
          res = childRes
        }
      }
    })
    return res
  }
}

ContainerLayout.propTypes = {
  apiDomain: PropTypes.string.isRequired,              // 接口请求地址,用于登出操作
  logo: PropTypes.string,                           // logo路径
  appName: PropTypes.string.isRequired,             // 平台名称
}

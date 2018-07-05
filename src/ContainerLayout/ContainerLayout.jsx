import React from 'react'
import { Layout, Menu, Icon, Popconfirm, Row, Col, Button, Avatar } from 'igroot'
import { Router, Link } from 'react-router-dom'
import createHashHistory from 'history/createHashHistory'
import PropTypes from 'prop-types'
import { logout, getLocalStorage, toggleFullScreen, setLocalStorage } from '../function'
import './ContainerLayout.scss'

const { SubMenu, Item } = Menu
const { Header, Content, Sider, Footer } = Layout
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
    console.log('componentWillMount')
    const menus = getLocalStorage('menu')
    this.historyListen(menus)

    const initialRoute = getLocalStorage('currentRoute')
    if (initialRoute) {
      hashHistory.push(initialRoute)
      localStorage.removeItem('currentRoute')
    }

    let route   // 初始得到的路由信息
    const { location: { hash } } = window
    route = hash.replace('#', "")

    console.log('初始route', route)


    let selectedMenu, openKey
    // 默认路径如果为／，则设置第一个叶子菜单为默认路由
    if (!route || route === '/') {

      const firstChildMenu = this.getFlatMenus(menus[0])[0]
      console.log('初始route为空，找到的menu是', firstChildMenu)
      openKey = menus[0].key
      selectedMenu = firstChildMenu
    } else {// 用户手动输入一个路由
      let menu = this.searchMenuByPath(menus, route)
      console.log('初始route不为空，找到的menu是', menu)
      if (!!menu) {
        const parentMenu = this.searchParentMenu(menu, menus)
        selectedMenu = menu
        openKey = parentMenu ? parentMenu.key : selectedKey
      }// 如果不存在说明用户输入的路径有误，或者没有权限，则进入平台自定义的404路由
    }

    // window.location.hash = selectedMenu.to
    if (selectedMenu.to !== route) {
      hashHistory.push(selectedMenu.to)
    }
    console.log(hashHistory)

    document.title = selectedMenu.name
    this.setState({
      openKeys: [openKey],
      selectedKeys: [selectedMenu.key]
    })


  }

  render() {
    const { selectedKeys, collapsed, openKeys } = this.state
    const { apiDomain, logo, appName, mode, needFooter } = this.props
    const menus = getLocalStorage('menu')
    console.log('openKeys', openKeys, 'selectedKeys', selectedKeys)

    const siderHeaderContainer = (
      <Layout style={{ height: '100%' }} id='container-page'>
        <Sider
          id="sider"
          trigger={null}
          collapsible
          collapsed={collapsed}>
          {
            logo ? (
              <div className="logo">
                <img src={logo} alt="logo" />
                <h1>{appName}</h1>
              </div>
            ) : (
                <div className="logo-only-name">
                  <div className="app-name">{appName}</div>
                </div>
              )
          }
          <Menu
            theme='dark'
            mode='inline'
            openKeys={openKeys}
            onOpenChange={this.handleOpenChange}
            selectedKeys={selectedKeys}
            style={{ width: '100%' }}
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
              {/* <Button icon="qq" style={{ marginRight: 32 }} onClick={() => { window.open('tencent://message/?uin=2923218206&Site=JooIT.com&Menu=yes') }}>联系我们</Button> */}
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
          {
            needFooter ? <Footer style={{ textAlign: 'center' }}> Copyright © 2018 白山云科技</Footer> : null
          }
        </Layout>
      </Layout>
    )
    const siderContainer = (
      <Layout style={{ height: '100%' }} id='container-page'>
        <Sider
          id="sider"
          collapsible
          collapsed={collapsed}
          onCollapse={this.onCollapse}>
          {
            logo ? (
              <div className="logo">
                <img src={logo} alt="logo" />
                <h1>{appName}</h1>
              </div>
            ) : (
                <div className="logo-only-name">
                  <div className="app-name">{appName}</div>
                </div>
              )
          }
          <div className="sider-user-area">
            <Popconfirm title='确定注销当前账号吗?' onConfirm={() => logout(apiDomain)}>
              <Avatar className="sider-avatar" shape="square" icon="user" style={{ marginRight: 12 }} />
            </Popconfirm>
            <span className="sider-user-name">
              <span style={{ marginRight: 12 }}>{JSON.parse(localStorage.getItem('cname')) || '未登录'}</span>
              <Popconfirm title='确定注销当前账号吗?' onConfirm={() => logout(apiDomain)}>
                <Icon type='logout' style={{ display: localStorage.getItem('cname') ? 'inline-block' : 'none' }} />
              </Popconfirm>
            </span>
          </div>
          <Menu
            theme='dark'
            mode='inline'
            openKeys={openKeys}
            onOpenChange={this.handleOpenChange}
            selectedKeys={selectedKeys}
            style={{ width: '100%' }}
          >
            {
              this.renderMenu(menus)
            }
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ margin: '12px 12px 0', height: '100%' }}>
            {this.props.children}
          </Content>
          {
            needFooter ? <Footer style={{ textAlign: 'center' }}> Copyright © 2018 白山云科技</Footer> : null
          }
        </Layout>
      </Layout>
    )
    const headerContainer = (
      <Layout style={{ height: '100%' }} id='header-page'>
        <Header>
          {
            logo ? (
              <span className="logo">
                <img src={logo} alt="logo" />
                <h1>{appName}</h1>
              </span>
            ) : (
                <span className="logo-only-name">
                  <span className="app-name">{appName}</span>
                </span>
              )
          }
          <Menu
            theme='dark'
            mode='horizontal'
            style={{ display: 'inline-block' }}
            onOpenChange={this.handleOpenChange}
            selectedKeys={selectedKeys}
          >
            {
              this.renderMenu(menus)
            }
          </Menu>
          <span style={{
            display: 'inline-block',
            float: 'right',
            height: '100%',
            cursor: 'pointer',
            fontSize: 16,
            color: '#fff'
          }}>
            <span style={{ marginRight: 12 }}>{JSON.parse(localStorage.getItem('cname')) || '未登录'}</span>
            <Popconfirm title='确定注销当前账号吗?' onConfirm={() => logout(apiDomain)}>
              <Icon type='logout' style={{ display: localStorage.getItem('cname') ? 'inline-block' : 'none' }} />
            </Popconfirm>
          </span>
        </Header>
        <Content style={{ margin: '12px 12px 0', height: '100%' }}>
          {this.props.children}
        </Content>
        {
          needFooter ? <Footer style={{ textAlign: 'center' }}> Copyright © 2018 白山云科技</Footer> : null
        }
      </Layout >
    )
    return (
      <Router history={hashHistory}>
        {
          mode === 'sider+header' ? siderHeaderContainer
            : (mode === 'sider' ? siderContainer : headerContainer)
        }
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
      console.log('hashHistory.listen', location.pathname)
      if (location.pathname !== '/') {
        let currentMenu = this.searchMenuByPath(menus, location.pathname)
        console.log('currentMenu', currentMenu)
        if (!!currentMenu) {
          let parentMenu = this.searchParentMenu(currentMenu, menus)
          console.log('parentMenu', parentMenu)
          document.title = currentMenu.name
          console.log(!!currentMenu && !!parentMenu && currentMenu.key !== this.state.selectedKeys[0])
          if (!!parentMenu && currentMenu.key !== this.state.selectedKeys[0]) {

            this.setState({
              selectedKeys: [currentMenu.key],
              openKeys: [parentMenu.key]
            })
          }
        }
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

    let curOpenKey      // 收缩后的 openKey 应该是空的
    let storageOpenKey  // 保存收缩前的 openKey
    if (collapsed) {
      curOpenKey = ""
      storageOpenKey = this.state.openKeys[0]
    } else {
      curOpenKey = getLocalStorage('openKey')
      storageOpenKey = ""
    }
    setLocalStorage('openKey', storageOpenKey)
    this.setState({
      collapsed,
      openKeys: [curOpenKey]
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
  apiDomain: PropTypes.string.isRequired,           // 接口请求地址,用于登出操作
  logo: PropTypes.string,                           // logo路径
  appName: PropTypes.string.isRequired,             // 平台名称
  mode: PropTypes.string,                           // 菜单模式：sider+header;sider;header
  needFooter: PropTypes.bool,                       // 是否需要页脚
}
ContainerLayout.defaultProps = {
  mode: 'sider+header',
  needFooter: true
}

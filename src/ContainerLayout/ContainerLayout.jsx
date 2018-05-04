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
      defaultOpenKeys: [],
      collapsed: false,
    }
  }

  componentWillMount() {
    const menus = getLocalStorage('menu')
    let firstMenu = menus[0]

    const { location: { hash } } = window
    const route = hash.replace('#', "")
    if (!!route && route !== '/') {
      firstMenu = this.searchMenuByPath(menus, route)
    }
    //页面刚挂载时的菜单定位
    let curMenuKey, curMenuPath
    const initialRoute = getLocalStorage('currentRoute')
    if (initialRoute) {
      curMenuPath = initialRoute
      const path = initialRoute.split('?')[0]
      let initialMenu = this.searchMenuByPath(menus, path)
      curMenuKey = initialMenu.key

      // localStorage.removeItem('currentRoute')
    } else {
      let currentMenu
      if (firstMenu.subs && firstMenu.subs.length > 0) {
        currentMenu = firstMenu.subs[0]
      } else {
        currentMenu = firstMenu
      }
      curMenuKey = currentMenu.key
      curMenuPath = currentMenu.to
    }

    hashHistory.push(curMenuPath)
    this.setState({
      selectedKeys: [curMenuKey],
      defaultOpenKeys: [firstMenu.key]
    })
    //end
    this.historyListen(menus)
  }

  render() {
    const { selectedKeys, collapsed, defaultOpenKeys } = this.state
    const { apiDomain, logo, appName } = this.props
    const menus = getLocalStorage('menu')

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
              defaultOpenKeys={defaultOpenKeys}
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

  // 监听浏览器地址栏变化，并联动菜单的选中状态
  historyListen = (menus) => {
    hashHistory.listen((location) => {
      let currentMenu = this.searchMenuByPath(menus, location.pathname)
      if (currentMenu.key !== this.state.selectedKeys[0]) {
        this.setState({
          selectedKeys: [currentMenu.key]
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

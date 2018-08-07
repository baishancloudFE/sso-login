import React from 'react'
import Authorized from './Authorized/Authorized'

const customStoreKeys = ['jwtToken', 'currentRoute', 'currentUrl', 'menu', 'apps', 'cname', 'apis', 'resources', 'name', 'JWT_TOKEN', 'MENU_INFO']
// 退出登录
const logout = (domain) => {
  const clearItems = customStoreKeys
  clearItems.forEach(item => {
    window.localStorage.removeItem(item)
  })
  window.location.assign(domain + '/account/user/logout')
}

// 在业务请求时发现 token 失效后的处理
const handleTokenInvalid = (domain) => {
  const clearItems = customStoreKeys
  clearItems.forEach(item => {
    window.localStorage.removeItem(item)
  })
  setLocalStorage('currentRoute', window.location.hash.replace('#', '')) // token失效时记录当前页面路由
  setLocalStorage('currentUrl', window.location.href)                    // token失效时记录当前页面的浏览器路径
  window.location.assign(domain + '/account/user/login')
}

const withLogin = (apiDomain, config) => (WrappedComponent) => class extends React.Component {

  render() {
    return (
      <Authorized apiDomain={apiDomain} {...config}>
        <WrappedComponent />
      </Authorized>
    )
  }
}

export { withLogin, logout, handleTokenInvalid }

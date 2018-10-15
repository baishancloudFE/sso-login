import React from 'react'
import Authorized from './Authorized/Authorized'
import { setLocalStorage } from './Authorized/function'

// 在本组件中存储在 localStorage 中的变量 key 值
const customStoreKeys = ['jwtToken', 'currentRoute', 'currentUrl', 'menu', 'apps', 'cname', 'apis', 'resources', 'name', 'JWT_TOKEN', 'MENU_INFO']

/**
 * 退出登录
 * @param {String} domain 基础 URL
 */
const logout = (domain) => {
  const clearItems = customStoreKeys
  clearItems.forEach(item => {
    window.localStorage.removeItem(item)
  })
  window.location.assign(domain + '/account/user/logout')
}

/**
 * 在业务请求时发现 token 失效后的处理
 * @param {String} domain 基础 URL
 */
const handleTokenInvalid = (domain) => {
  const clearItems = customStoreKeys
  clearItems.forEach(item => {
    window.localStorage.removeItem(item)
  })
  setLocalStorage('currentRoute', window.location.hash.replace('#', '')) // token失效时记录当前页面路由
  setLocalStorage('currentUrl', window.location.href)                    // token失效时记录当前页面的浏览器路径
  window.location.assign(domain + '/account/user/login')
}

/**
 * 高阶组件，用于 客户端对接 SSO 登录过程
 * @param {String} apiDomain 基础 URL
 * @param {Object} config 其他配置
 */
const withLogin = (apiDomain, config) => (WrappedComponent) => class extends React.Component {

  render() {
    console.log('%csso-login文档传送门👇\n%c https://www.npmjs.com/package/sso-login', 'text-shadow:1px 1px 1px rgba(0,0,0,0.2);font-size:24px', 'font-size:14px')

    return (
      <Authorized apiDomain={apiDomain} realNode={<WrappedComponent />} {...config} />
    )
  }
}

export { withLogin, logout, handleTokenInvalid }

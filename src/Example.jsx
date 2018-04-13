import React, { Component } from 'react'
import { Spin } from 'igroot'

function parseUrlParams(url) {
  const result = {}
  const params = url.split('?')[1]

  params && params.split('&').forEach(item => {
    const pair = item.split('=')
    result[pair[0]] = pair[1]
  })

  return result
}

function removeParameter(str) {
  return str.replace(/(^\?|&)ticket=[^&]*(&)?/g, function (p0, p1, p2) {
    return p1 === '?' || p2 ? p1 : ''
  })
}

function isEmpty(obj) {
  for (const name in obj) {
    return false
  }

  return true
}

function setLocalStorage(key, value) {
  if (!window.localStorage) {
    alert('浏览器不支持localstorage')
    return false
  }

  const newValue = JSON.stringify(value)
  window.localStorage.setItem(key, newValue)
  // console.log(window.localStorage.getItem(key))
}

function getLocalStorage(key) {
  if (!window.localStorage) {
    alert('浏览器不支持localstorage')
    return false
  }

  return JSON.parse(window.localStorage.getItem(key))
}
export default class Login extends Component {
  constructor(props) {
    super(props)

    const { env } = this.props
    const host = location.host
    let serverHost = ''
    let serverEnv = ''
    Object.keys(env).forEach(e => {
      if (env[e].regex && env[e].host && host.match(env[e].regex)) {
        serverHost = env[e].host
        serverEnv = e
      }
    })

    this.state = {
      devLogin: 'http://test-roster.i.trpcdn.net/staff-center',
      serverLogin: '/account/user/login',
      serverView: '/account/user/view',
      serverValidate: '/account/token/validate',
      serverLogout: '/account/user/logout',
      needReload: this.props.needReload,
      serverHost,
      serverEnv,
      isLogin: false
    }
  }

  componentWillMount() {
    this.login().then((isTokenValidate) => {
      console.log(isTokenValidate)
      this.setState({ isLogin: isTokenValidate })
    })
  }

  render() {
    const { isLogin } = this.state
    console.log('渲染父')
    return (
      <div style={{ width: '100%' }}>
        <Spin spinning={!isLogin} tip="正在初始化您的用户信息..." size="large">
          {this.props.children}
        </Spin>
      </div>
    )
  }

  login() {
    const { serverHost, serverEnv, serverView, devLogin, serverLogin, serverLogout } = this.state
    const { appId } = this.props

    return new Promise((resolve, reject) => {
      const jwtToken = getLocalStorage('jwtToken')
      const query = parseUrlParams(location.href)
      let ticket = null

      if (!isEmpty(query)) {
        ticket = query.ticket

        const pathName = location.pathname || ''
        const param = location.hash.replace(/\?ticket=[^&]*/, '')
        const url = `${pathName}${param}`

        history.pushState(null, '', url)
      }

      if (!jwtToken) {
        this.checkLogin(ticket, (isTokenValidate) => {
          resolve(isTokenValidate)
        })
      } else {
        this.validateToken((isTokenValidate) => {
          resolve(isTokenValidate)
        })
      }
    })
  }

  redirectLogin() {
    const { serverHost, serverEnv, devLogin, serverLogin } = this.state
    const { appId } = this.props

    if (serverEnv === 'local') {
      const callback = location.href
      const redirectUrl = `${devLogin}?appId=${appId}&callback=${callback}`
      location.assign(redirectUrl)
    } else {
      location.assign(serverHost + serverLogin)
    }
  }

  checkLogin = (ticket, callback) => {
    console.log('checkLogin')
    const { serverView, serverHost, needReload } = this.state
    const fetchInit = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/jsoncharset=utf-8'
      }
    }
    const userInfoUrl = serverHost + serverView
    const infoUrl = ticket ? (`${userInfoUrl}?ticket=${ticket}`) : userInfoUrl

    const getUserView = () => fetch(infoUrl, fetchInit)
      .then(res => res.json())
      .then(res => {
        const { data } = res

        // 执行用户的回调函数
        this.props.callback.forEach(c => {
          if (res.code === c.code) {
            c.function()
          }
        })

        switch (res.code) {
          case 0:
            // 将所有的用户信息存储在localStorage
            const userInfo = res.data
            Object.keys(userInfo).forEach(k => {
              setLocalStorage(k, userInfo[k])
            })

            // 处理旧SL只在项目第一次加载时实例化fetch请求对象，导致正确的token无法正常设置的问题
            if (needReload) {
              window.location.reload()
            }
            callback && callback(true)
            break
          case 605:
            this.redirectLogin()
            break
          case -1:
            getUserView()
            console.error(res.msg)
            break
        }

        return res
      })
      .catch((err) => {
        console.error('请求失败', err)
      })
    getUserView()
  }
  validateToken(callback) {
    console.log('validateToken')
    const { serverHost, serverValidate } = this.state

    const fetchInit = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/jsoncharset=utf-8',
        'Authorization': `Bearer ${!!window.localStorage['jwtToken'] ? JSON.parse(window.localStorage['jwtToken']) : ''}`
      }
    }

    const validateUrl = serverHost + serverValidate

    fetch(validateUrl, fetchInit)
      .then(res => res.json())
      .then(res => {
        switch (res.code) {
          case 0:
            callback && callback(true)
            break
          case 600:
            this.logout()
            break
          case -1:
            callback && callback(false)
            console.error('请求失败', res.msg)
            break
          default:
            this.logout()
        }

        return res
      })
      .catch((err) => {
        console.error('请求失败', err)
      })
  }

  // 退出登录
  logout() {
    const { serverHost, serverEnv, serverLogout, devLogin } = this.state

    const logoutUrl = serverHost + serverLogout
    localStorage.clear()
    location.assign(logoutUrl)
  }

  getUserInfo() {
    const userInfo = getLocalStorage('cname')
    return userInfo
  }

  getMenuInfo() {
    const menuInfo = getLocalStorage('menu')
    return menuInfo
  }
}

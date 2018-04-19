import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { parseUrlParams, removeParameter, isEmpty, setLocalStorage, getLocalStorage } from './function'
import './login.scss'
//                    _ooOoo_
//                   o8888888o
//                   88\" . \"88
//                   (| 0_0 |)
//                   O\\  =  /O
//                ____/`---'\\____
//              .'  \\\\|     |//  `.
//             /  \\\\|||  :  |||//  \\
//            /  _||||| -:- |||||-  \\
//            |   | \\\\\\  -  /// |   |
//            | \\_|  ''\\---/''  |   |
//            \\  .-\\__  `-`  ___/-. /
//          ___`. .'  /--.--\\  `. . __
//       .\"\" '<  `.___\\_<|>_/___.'  >'\"\
//      | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |
//      \\  \\ `-.   \\_ __\\ /__ _/   .-` /  /
// ======`-.____`-.___\\_____/___.-`____.-'======
//                    `=---='",
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//          佛祖保佑       永无BUG

const defaultConfig = {
  devLogin: 'http://test-roster.i.trpcdn.net/staff-center',
  serverLogin: '/account/user/login',
  serverView: '/account/user/view',
  serverValidate: '/account/token/validate',
  serverLogout: '/account/user/logout',
}

class Login extends Component {
  constructor(props) {
    super(props)

    this.config = {
      ...defaultConfig
    }

    this.state = {
      isLogin: false
    }
  }

  componentWillMount() {
    this.login().then((isTokenValidate) => {
      this.setState({ isLogin: isTokenValidate })
    })
  }

  render() {
    const { isLogin } = this.state
    const { className, style } = this.props
    return (
      <div className={className} style={style}>
        {
          isLogin ? this.props.children :
            (
              <div id="loading-wrapper">
                <div id="loading-text">LOGING</div>
                <div id="loading-content"></div>
              </div>
            )
        }
      </div>
    )
  }

  login() {
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
    const { serverLogin } = this.config
    const { apiDomain } = this.props

    location.assign(apiDomain + serverLogin)
  }

  checkLogin = (ticket, callback) => {
    const { serverView } = this.config
    const { apiDomain, needReload, onLogin } = this.props
    const fetchInit = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/jsoncharset=utf-8'
      }
    }
    const userInfoUrl = apiDomain + serverView
    const infoUrl = ticket ? (`${userInfoUrl}?ticket=${ticket}`) : userInfoUrl

    fetch(infoUrl, fetchInit)
      .then(res => res.json())
      .then(res => {
        const { data } = res

        // 执行用户的回调函数
        onLogin.forEach(c => {
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
          case 605:// 无效的ticket(平台服务端拿到的ticket是空的)
          case -1: // 无效的ticket(ticket过期了，好像是10s过期，who cares，反正就是ticket不可用)
            this.redirectLogin()
            break
        }
        return res
      })
      .catch((err) => {
        console.error('请求失败', err)
      })
  }

  // 验证 jwtToken 的有效性
  validateToken(callback) {
    const { serverValidate } = this.config
    const { apiDomain } = this.props

    const fetchInit = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/jsoncharset=utf-8',
        'Authorization': `Bearer ${!!window.localStorage['jwtToken'] ? JSON.parse(window.localStorage['jwtToken']) : ''}`
      }
    }

    const validateUrl = apiDomain + serverValidate

    fetch(validateUrl, fetchInit)
      .then(res => res.json())
      .then(res => {
        switch (res.code) {
          case 0:
            callback && callback(true)
            break
          case 1001:
            this.redirectLogin()
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
    const { serverLogout, devLogin } = this.config
    const { apiDomain } = this.props

    const logoutUrl = apiDomain + serverLogout
    localStorage.clear()
    location.assign(logoutUrl)
  }
}

Login.propTypes = {
  needReload: PropTypes.bool,                       // 是否需要reload，项目中存在 SL过早实例化请求对象 的问题的，这一项需要传true
  apiDomain: PropTypes.string.isRequired,           // 接口请求地址
  onLogin: PropTypes.array,                         // 在获取到用户信息后的特殊处理
  className: PropTypes.string,                      // Login组件 的 className
  style: PropTypes.object                           // Login组件 的 style
}

Login.defaultProps = {
  needReload: false,
  apiDomain: '',
  onLogin: [],
  className: '',
  style: { height: '100%', width: '100%' }
}

export default Login

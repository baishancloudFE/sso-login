import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { parseUrlParams, setLocalStorage, getLocalStorage } from './function'
import './index.scss'

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
const fetchInit = {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/jsoncharset=utf-8'
  }
}
const defaultAnimation = (
  <div id="sso-loading-wrapper">
    <div id="sso-loading-text">LOADING</div>
    <div id="sso-loading-content"></div>
  </div>
)

class Authorized extends Component {
  constructor(props) {
    super(props)

    this.customVariables = {
      apiLogin: '/account/user/login',
      apiView: '/account/user/view',
      apiValidate: '/account/token/validate',
      apiLogout: '/account/user/logout',
    }

    this.state = {
      hasSuccessLogined: false,
      isLogining: true
    }
  }

  componentDidMount() {
    this.login()
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true })
  }

  render() {
    if (this.state.hasError) {
      return <h1>Oops! Something went wrong.</h1>
    }

    const { hasSuccessLogined, isLogining } = this.state
    const { needDefaultAnimation, animation, realNode } = this.props
    const realAnimation = needDefaultAnimation ? defaultAnimation : (animation || null)

    this.LogLoginedResult(hasSuccessLogined, isLogining)

    return (
      <React.Fragment>
        {isLogining ? realAnimation : realNode}
      </React.Fragment>
    )
  }

  /**
   * 登录
   */
  login = () => {
    const token = this.getJwtToken()
    this.log('token', token)

    if (!token) {
      const query = parseUrlParams(location.href)
      const ticket = query && query.ticket

      this.log('ticket', ticket)

      this.getUserInfo(ticket, (isTokenValidate) => {
        this.setState({ hasSuccessLogined: isTokenValidate, isLogining: false })
        this.removeTicketFromUrl()
      })
    } else {
      if (this.props.needCheckTokenValidity) {
        this.validateToken(isTokenValidate => this.setState({ hasSuccessLogined: isTokenValidate, isLogining: false }))
      } else {
        this.setState({ hasSuccessLogined: true, isLogining: false })
      }
    }
  }

  /**
   * 将 url 中带着的 ticket 去掉
   */
  removeTicketFromUrl = () => {
    const pathName = location.pathname || ''
    const param = location.hash.replace(/\?ticket=[^&]*/, '')
    const url = `${pathName}${param}`
    history.pushState(null, '', url)
  }

  /**
   * 获取用户信息（带着 ticket 去请求 /account/user/view 接口）
   * @param {func} callback: 得到 /account/user/view 接口的响应后的回调函数
   */
  getUserInfo = (ticket, callback) => {
    const { apiView } = this.customVariables
    const { apiDomain, needReload, onLogin, inValidateViewCode } = this.props

    const userInfoUrl = apiDomain + apiView
    const infoUrl = ticket ? (`${userInfoUrl}?ticket=${ticket}`) : userInfoUrl

    fetch(infoUrl, fetchInit)
      .then(res => res.json())
      .then(res => {
        this.log('view接口获得的返回值', res)
        // 执行用户的回调函数
        onLogin.forEach(c => {
          if (res.code === c.code) {
            c.function()
          }
        })

        const code = res.code + ''
        switch (code) {
          case '0':
            // 将所有的用户信息存储在localStorage
            this.props.storeData(res.data)
            setLocalStorage('jwtToken', res.data && res.data.jwtToken)

            // 处理旧SL只在项目第一次加载时实例化fetch请求对象，导致正确的token无法正常设置的问题
            if (needReload) {
              window.location.reload()
            }
            callback && callback(true)
            break
          case inValidateViewCode + '':// 无效的ticket(平台服务端拿到的ticket是空的)
          case '-1': // 无效的ticket(ticket过期了，好像是10s过期，who cares，反正就是ticket不可用)
            this.redirectLogin()
            break
        }
        return res
      })
      .catch((err) => {
        console.error('请求 /account/user/view 接口失败!', err)
      })
  }

  /**
   * 验证 jwtToken 的有效性（请求 /account/token/validate 接口）
   * @param {func} callback 得到 /account/token/validate 接口的响应后的回调函数
   */
  validateToken(callback) {
    const curFetchConfig = JSON.parse(JSON.stringify(fetchInit))
    if (!!this.getJwtToken()) {
      curFetchConfig.headers.Authorization = `Bearer ${this.getJwtToken()}`
    }

    const { apiValidate } = this.customVariables
    const { apiDomain, inValidateTokenCode } = this.props
    const validateUrl = apiDomain + apiValidate

    fetch(validateUrl, curFetchConfig)
      .then(res => res.json())
      .then(res => {
        this.log('validate接口获得的返回值', res)

        const code = res.code + ''
        switch (code) {
          case '0':
            callback && callback(true)
            break
          case inValidateTokenCode:
            this.redirectLogin()
            break
          case '-1':
            callback && callback(false)
            console.error('请求 /account/token/validate 接口响应code=-1', res.msg)
            break
          default:
            this.logout()
        }

        return res
      })
      .catch((err) => {
        console.error('请求 /account/token/validate 接口失败', err)
      })
  }

  /**
   * 重新请求 /account/user/login 接口
   */
  redirectLogin() {
    const { apiLogin } = this.customVariables
    const { apiDomain } = this.props

    this.clearLocalStorage()
    setLocalStorage('currentRoute', window.location.hash.replace('#', ''))// token失效时记录当前页面路由
    setLocalStorage('currentUrl', location.href)                          // token失效时记录当前页面的浏览器路径

    window.location.assign(apiDomain + apiLogin)
  }

  /**
   * 退出登录
   */
  logout = () => {
    this.clearLocalStorage()
    window.location.assign(this.props.apiDomain + this.customVariables.apiLogout)
  }

  /**
   * 打印 SSO 登录结果
   * @param {bool}} hasSuccessLogined: 是否登录成功
   * @param {bool}} isLogining: 是否正在登录
   */
  LogLoginedResult = (hasSuccessLogined, isLogining) => {
    if (!isLogining) {
      if (!hasSuccessLogined) {
        console.error('您的 SSO 登录没有成功！请检查登录流程！')
      } else {
        console.log('您的 SSO 登录已经成功！')
      }
    }
  }

  /**
   * 打印调试日志的开关（只有在LocalStorage中把 displayLog 设置为 true 才可以查看日志）
   */
  log = (...content) => {
    const displayLog = getLocalStorage('displaySsoLog')
    if (displayLog) {
      console.log(...content)
    }
  }

  /**
   * 自定义的清理 window.localStorage，保留 用户自己需要存储在 window.localStorage 的变量
   */
  clearLocalStorage = () => {
    const clearItems = ['jwtToken', 'currentRoute', 'currentUrl', 'menu', 'apps', 'cname', 'apis', 'resources', 'name', 'JWT_TOKEN', 'MENU_INFO']
    clearItems.forEach(item => {
      window.localStorage.removeItem(item)
    })
  }

  /**
   * 从 localStorage 中获取 jwtToken 数据
   */
  getJwtToken = () => getLocalStorage('jwtToken')
}

Authorized.propTypes = {
  apiDomain: PropTypes.string.isRequired,           // 接口请求地址
  onLogin: PropTypes.array,                         // 在获取到用户信息后的特殊处理
  inValidateTokenCode: PropTypes.number,            // 用户自定义的token无效的code
  inValidateViewCode: PropTypes.number,             // view接口异常的code
  animation: PropTypes.node,                        // 自定义的加载动画
  storeData: PropTypes.func,                        // 自定义存储用户信息的方式
  needDefaultAnimation: PropTypes.bool,             // 是否需要内置的loading动画
  needReload: PropTypes.bool,                       // 是否需要reload，项目中存在 SL过早实例化请求对象 的问题的，这一项需要传true
  needCheckTokenValidity: PropTypes.bool,           // 是否需要在页面刷新的时候验证token的有效性
}

Authorized.defaultProps = {
  needReload: false,
  apiDomain: '',
  onLogin: [],
  inValidateTokenCode: 1001,
  inValidateViewCode: 605,
  needDefaultAnimation: true,
  storeData: function (userInfo) {
    Object.keys(userInfo).forEach(k => {
      const newValue = JSON.stringify(userInfo[k])
      window.localStorage.setItem(k, newValue)
    })
  },
  needCheckTokenValidity: true
}

export default Authorized

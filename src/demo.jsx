import React from 'react'
import { Button, Icon } from 'igroot'
import Login from './Login'
import './Login.scss'
import { getLocalStorage } from './function'

const callbacks = [{
  code: 1003,
  function: () => {
    alert('您没有访问应付系统的权限！')
  }
}]

// const domain = "http://test-roster.i.trpcdn.net"
const domain = "http://test-pps.i.trpcdn.net"

export default () => {
  return (
    <Login
      apiDomain={domain}
      needDefaultAnimation={false}
      animation={(
        <div id="sso-loading-wrapper">
          <div id="sso-loading-text">LOADING</div>
          <div id="sso-loading-content"></div>
        </div>
      )}
      onLogin={callbacks}>
      <Login.ContainerLayout
        apiDomain={domain}
        logo="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
        appName="SSO登录测试"
        mode="header"
      >
        <div style={{ height: 1200, width: '100%' }}>
          <Login.CheckPermission apiName="customer">
            <Button type="primary" size="large">测试接口权限控制</Button>
          </Login.CheckPermission>
        </div>
      </Login.ContainerLayout>
    </Login >
  )
}

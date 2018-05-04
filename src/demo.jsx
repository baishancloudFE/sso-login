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

export default () => {
  return (
    <Login
      apiDomain={'http://test-pps.i.trpcdn.net'}
      needDefaultAnimation={false}
      animation={(
        <div id="loading-wrapper">
          <div id="loading-text">LOADING</div>
          <div id="loading-content"></div>
        </div>
      )}
      onLogin={callbacks}>
      <Login.ContainerLayout
        apiDomain='http://test-pps.i.trpcdn.net'
        logo="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
        appName="SSO登录测试"
      >
        <Login.CheckPermission apiName="customer">
          <Button type="primary" size="large">测试接口权限控制</Button>
        </Login.CheckPermission>
      </Login.ContainerLayout>
    </Login >
  )
}

import React from 'react'
import { Button, Icon } from 'igroot'
import { Route, Router, Link, Switch, Redirect } from 'react-router-dom'
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
      >
        <div style={{ height: 1200, width: '100%' }}>
          <Switch>
            {
              (JSON.parse(localStorage.getItem('menu')) || []).map(menu => (
                <Route exact path={menu.to} render={() => <h1>{menu.name}</h1>} />
              ))
            }
            <Route exact path='/403' render={() => <h1>/403</h1>} />
            <Redirect exact to='/403' path='/' />
          </Switch>
        </div>
      </Login.ContainerLayout>
    </Login >
  )
}

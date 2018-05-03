import React from 'react'
import Login from './Login'
import './login.scss'

const callbacks = [{
  code: 1003,
  function: () => {
    alert('您没有访问应付系统的权限！')
  }
}]

export default () => (
  <Login
    apiDomain={'http://172.18.11.112:23000'}
    // needDefaultAnimation
    animation={(
      <div id="loading-wrapper">
        <div id="loading-text">LOADING</div>
        <div id="loading-content"></div>
      </div>
    )}
    onLogin={callbacks}>
    以下是从SSO获取到的您的用户信息：
    {
      Object.keys(localStorage).map(k => {
        return <div style={{ textAlign: 'left', width: 1200 }}>
          <span style={{ width: 100 }}>{k} : </span>
          <span style={{ width: 1100 }}>{localStorage[k]}</span>
          <hr />
        </div>
      })
    }
  </Login >
)

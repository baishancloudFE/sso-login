import React from 'react'
import ReactDOM from 'react-dom'
import Login from './Example'
import domain from './domain'

const env = {
  local: {
    regex: /localhost/,
    host: 'http://172.18.11.112:23000'
  },
  prod: {
    regex: /jiuhua/,
    host: 'http://service-jiuhua.baishancloud.com'
  },
  test: {
    regex: /172\.18\.11\.112/,
    host: 'https://service-jiuhua.bs58i.baishancloud.com'
  }
}
const callback = [{
  code: 1003,
  function: () => {
    // ReactDOM.render((
    //   <div style={{ textAlign: 'center' }}>
    //     <img src='/static/info.png' style={{ display: 'block', margin: '0 auto', marginTop: 180 }} />
    //     <div style={{ margin: '0 auto', marginTop: 40, fontSize: 18 }}>您没有访问应付系统的权限！</div>
    //   </div>
    // ), document.getElementById('app'))
    alert('您没有访问应付系统的权限！')
  }
}]

export default () => (
  <Login
    appId={50}
    env={env}
    callback={callback}
    needReload={true} >
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

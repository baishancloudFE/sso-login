# SSO-login 组件
> 前端对接 SSO 的通用组件

### 使用

下载 npm 包
```jsx
sl add -c sso-login
```

在 bsy.json 中登记
```jsx
{
  "options": {
    "esModule": [
      "sso-login"
    ]
  }
}
```

在代码中使用
```jsx
import Login from 'sso-login'

ReactDOM.render(
  (
    <Login apiDomain={'http://test.service.com'}>
    {
      // 您的业务组件
    }
  </Login >
  ), mountNode)
```

### 开放属性

| 参数        | 是否必填   | 说明    |  类型  |  默认值
| --------   | ----------:| -----:   | :----: |  :----: |
| apiDomain   | 必填     | 接口请求地址      |   string    | -
| needReload | 非必填| 是否需要reload，项目中存在 SL过早实例化请求对象 的问题的，这一项需要传true      |   boolean    | false
| onLogin    | 非必填|   在获取到用户信息后的特殊处理    |   [{code:xxx,function:()=>{}}]    | -
| className    | 非必填|   Login组件 的 className    |   string    | -
| style    | 非必填|   Login组件 的 style    |   object    | -
| needDefaultAnimation | 非必填   |   是否需要内置的loading动画    |   boolean    | false
| animation    | 非必填|   自定义的加载动画    |   dom节点    | -

### 静态方法

#### logout
> 登出
```jsx
import Login from 'sso-login'
const {logout}=Login

logout(apiDomain)
```

#### onTokenInvalid
> token失效时
```jsx
import Login from 'sso-login'
const {onTokenInvalid}=Login

onTokenInvalid(apiDomain)
```

### 静态组件
> 由于 侧边菜单栏以及吊顶均基于 SSO 提供的用户信息来渲染，所以 SSO-login 组件还提供了 ContainerLayout 和 CheckPermission 两个子静态组件来提高您开发的效率，具体介绍如下：

#### ContainerLayout 的开放属性
> ContainerLayout 是布局组件，渲染侧边菜单栏以及顶部header

| 参数        | 是否必填   | 说明    |  类型  |  默认值
| --------   | ----------:| -----:   | :----: |  :----: |
| apiDomain   | 必填     | 接口请求地址      |   string    | -
| logo | 非必填| logo地址      |   string    | -
| appName    | 必填|   平台名称     |   string    | -

在代码中使用
```jsx
import Login from 'sso-login'

ReactDOM.render(
  (
    <Login apiDomain={'http://test-pps.i.trpcdn.net'}>
      <Login.ContainerLayout
        apiDomain={url}
        logo={logoUrl}
        appName="xxxx"
      >
        {
          // 您的路由
        }
      </Login.ContainerLayout>
    </Login >
  ), mountNode)

```

#### CheckPermission 的开放属性
> CheckPermission 是接口权限判断组件，使用该组件的前提是您的服务端有返回apis接口权限列表

| 参数        | 是否必填   | 说明    |  类型  |  默认值
| --------   | ----------:| -----:   | :----: |  :----: |
| apiName   | 必填     | 接口名称，可以填写接口全称，也可以填写唯一的key，例如您的接口名称是'/defalut/customer' ，您可以填写 '/defalut/customer'或者'customer'|   string    | -

在代码中使用
```jsx
import Login from 'sso-login'

<Login.CheckPermission apiName="customer">
  <Button>xx操作</Button>
</Login.CheckPermission>
```

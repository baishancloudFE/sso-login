# SSO-login 组件
> 前端对接 SSO 的通用组件


### 使用

下载 npm 包
```jsx
npm i --save sso-login
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
import {withLogin} from 'sso-login'

// 在定义您的 根业务组件 时，在其 前面加上装饰器 withLogin，并传递参数 baseUrl
@withLogin(baseUrl)
export class App extends React.Component {
  // xxxxxxxxx
}

// 如果需要传递别的参数，如下操作
@withLogin(baseUrl,{needDefaultAnimation:true})
export class App extends React.Component {
  // xxxxxxxxx
}
```

### 开放属性

| 参数        | 是否必填   | 说明    |  类型  |  默认值
| --------   | ----------:| -----:   | :----: |  :----: |
| apiDomain   | 必填     | 接口请求地址      |   string    | -
| className    | 非必填|   Login组件 的 className    |   string    | -
| style    | 非必填|   Login组件 的 style    |   object    | -
| animation    | 非必填|   自定义的加载动画    |   dom节点    | -
| onLogin    | 非必填|   在获取到用户信息后的特殊处理    |   [{code:xxx,function:()=>{}}]    | -
| storeData    | 非必填|   在获取到用户信息后的特殊处理    |   见下方    | -
| inValidateTokenCode    | 非必填|   用户自定义的token无效的code    |  number   | 1001
| inValidateViewCode    | 非必填|   用户自定义的view接口异常的code    |  number   | 605
| needReload | 非必填| 是否需要reload，项目中存在 SL过早实例化请求对象 的问题的，这一项需要传true      |   boolean    | false
| needDefaultAnimation | 非必填   |   是否需要内置的loading动画    |   boolean    | false
| needCheckTokenValidity | 非必填   |   是否需要在页面刷新的时候验证token的有效性    |   boolean    | true

```jsx
// storeData 的示例
function (userInfo) {
    Object.keys(userInfo).forEach(k => {
      const newValue = JSON.stringify(userInfo[k])
      window.localStorage.setItem(k, newValue)
    })
  }
```

### 静态方法

#### logout
> 登出
```jsx
import { logout } from 'sso-login'
logout(apiDomain)
```

#### handleTokenInvalid
> token失效时
```jsx
import { handleTokenInvalid } from 'sso-login'
handleTokenInvalid(apiDomain)
```


### 更新日志

# 发布周期

- 修订版本号：每周末会进行日常 bugfix 更新。（如果有紧急的 bugfix，则任何时候都可发布）

- 次版本号：每月发布一个带有新特性的向下兼容的版本。

- 主版本号：含有破坏性更新和新特性，不在发布周期内。

# 0.0.11 
> 2018.04.20
> - 🌟 第一个稳定版本

# 0.1.0 
> 2018.04.26
> - 🐞 在调用 '/account/user/login' 接口重新获取用户信息前清除localStroage，修复token过期后死循环的bug

# 0.1.1
> 2018.05.03
> - 🌟 开场动画可以自定义

# 0.2.0
> 2018.05.04
> -  🌟 记录token失效前的浏览器地址
> -  🌟 提供静态子组件 ContainerLayout 和 CheckPermission
> -  🌟 提供静态方法 logout 和 onTokenInvalid

# 0.2.1
> 2018.05.04
> -  🌟 新增全屏操作按钮

# 0.2.2
> 2018.05.04
> -  💄 记录在 localStorage 的原路由地址在使用后清除

# 0.2.3
> 2018.05.04
> -  🐞 修复刷新后总是呈现 localStorage 的原路由的bug

# 0.2.4
> 2018.05.07
> - 🌟 展开一个新的父级菜单后，收起当前的父级菜单

# 0.2.5
> 2018.05.07
> - 💄 还原token失效前的浏览器地址放在登录组件中做

# 0.2.6
> 2018.05.07
> - 🌟 浏览器标题根据菜单动态显示

# 0.2.8
> 2018.05.08
> - 🐞 尴尬，因为文件名大小写没有成功提交到git连升两个小版本

# 0.2.9
> 2018.05.11
> - 💄 重写 loading 中 div 组件标签，避免与业务中的ID重名

# 0.2.10
> 2018.05.11
> - 💄 加了页脚，逼格杠杠的

# 0.2.11
> 2018.05.11
> - 💄 页脚可以选择是否需要
> - 🌟 新增三种菜单模式：sider+header;sider;header

# 0.2.12
> 2018.05.14
> - 💄 经过深思熟虑，sso登录组件中只记录token失效前的地址，跳转由平台自己实现，也可以使用sso提供的静态菜单渲染组件（里面有做跳转）
> - 💄 去掉onTokenInvalid静态方法的location参数，更方便，更友好

# 0.2.13
> 2018.05.17
> - 💄 样式兼容只有appName没有logo图标的情况

# 0.2.14
> 2018.06.08
> - 🐞 修复logout函数中变量引用不正确的bug

# 0.2.16
> 2018.06.08
> - 🌟 为验证token是否有效的接口增加自定义状态码的功能

# 0.2.20
> 2018.07.02
> - 🌟 添加storeData配置项：可以自己定义如何存储sso给的用户信息

# 0.2.21
> 2018.07.03
> - 🌟 添加 needCheckTokenValidity 配置项：可以配置是否需要在刷新页面时调用 validate 接口

# 1.0.0
> 2018.08.07
> - 🌟 改为装饰器模式，onTokenInvalid 改为 handleTokenInvalid

# 1.0.1
> 2018.08.20
> - 🌟 增加inValidateViewCode属性，支持用户自定义view接口异常情况

# 1.0.2
> 2018.09.10
> - 🐞 修复 needCheckTokenValidity 变量引用来源错误，导致validate接口没有调用的bug

# 1.0.3
> 2018.09.29
> - 💄 优化代码

# 1.0.4
> 2018.10.10
> - 🐞 修复刷新页面检测到没有 token 后直接显示登录失败的bug

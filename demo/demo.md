# API

| 参数        | 说明    |  类型  |  默认值
| --------   | -----:   | :----: |  :----: |
| apiDomain        | 必填，接口请求地址      |   string    | -
| needReload | 是否需要reload，项目中存在 SL过早实例化请求对象 的问题的，这一项需要传true      |   boolean    | false
| onLogin    |   在获取到用户信息后的特殊处理    |   [{code:xxx,function:()=>{}}]    | -
| className    |   Login组件 的 className    |   string    | -
| style    |   Login组件 的 style    |   object    | -

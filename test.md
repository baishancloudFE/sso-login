# 测试用例

- 测试登录主流程
  - login => 取 ticket 后 view

- 测试 接口1001
  > 接口 401 氛围两种情况：一种是 IP 登录变更引起的 token 失效，另一种是 token 因时间问题而失效，暂时只需要处理后一种情况，以code=1001来判断
  - 内网登录后，切换 vpn,重新登录
  - 内网登录后，token 失效，重新请求 login 接口，不重新做登录操作，即可重新取得 token
  - vpn 登录后，token 失效，重新请求 login 接口，不重新做登录操作，即可重新取得 token


# 待办事项

- inValidateTokenCode => inValidTokenCode
- inValidateViewCode => inValidViewCode

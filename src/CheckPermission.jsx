import React from 'react'
import PropTypes from 'prop-types'

export class CheckPermission extends React.PureComponent {
  render() {
    const apis = JSON.parse(localStorage.getItem('apis')) || []
    const auth = this.props.apiName ?
      apis.some(a => a.resource.split('/')[1] === this.props.apiName || a.resource === this.props.apiName)
      : false

    return (
      auth ? this.props.children : null
    )
  }
}
CheckPermission.propTypes = {
  apiName: PropTypes.string,                      // AuthorityControl 组件的 接口名称
}

function parseUrlParams(url) {
  const result = {}
  const params = url.split('?')[1]

  params && params.split('&').forEach(item => {
    const pair = item.split('=')
    result[pair[0]] = pair[1]
  })

  return result
}

function removeParameter(str) {
  return str.replace(/(^\?|&)ticket=[^&]*(&)?/g, function (p0, p1, p2) {
    return p1 === '?' || p2 ? p1 : ''
  })
}

function isEmpty(obj) {
  for (const name in obj) {
    return false
  }

  return true
}

function setLocalStorage(key, value) {
  if (!window.localStorage) {
    alert('浏览器不支持localstorage')
    return false
  }

  const newValue = JSON.stringify(value)
  window.localStorage.setItem(key, newValue)
  // console.log(window.localStorage.getItem(key))
}

function getLocalStorage(key) {
  if (!window.localStorage) {
    alert('浏览器不支持localstorage')
    return false
  }

  return JSON.parse(window.localStorage.getItem(key))
}

export { parseUrlParams, removeParameter, isEmpty, setLocalStorage, getLocalStorage }

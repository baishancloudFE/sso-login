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
}

function getLocalStorage(key) {
  if (!window.localStorage) {
    alert('浏览器不支持localstorage')
    return false
  }

  return JSON.parse(window.localStorage.getItem(key))
}


const logout = (domain) => {
  window.localStorage.clear()
  window.location.assign(domain + '/account/user/logout');
}
const refreshUserInfo = (domain) => {
  window.localStorage.clear()
  window.location.assign(domain + '/account/user/login');
}

const toggleFullScreen = () => {
  const doc = window.document;
  const docEl = doc.documentElement;

  const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
  const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

  if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    requestFullScreen.call(docEl);
  }
  else {
    cancelFullScreen.call(doc);
  }
}

export { parseUrlParams, removeParameter, isEmpty, setLocalStorage, getLocalStorage, logout, refreshUserInfo, toggleFullScreen }

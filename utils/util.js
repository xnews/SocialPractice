const formatTime = (_date) => {
  // 服务器时间直接转化无法变成我们中国时区想要的时间，还需要再增加8小时的毫秒数
  const date = new Date(_date + 8 * 60 * 60 * 1000)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatDate = (_date) => {
  const date = new Date(_date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1 
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const randomString = code => {
  let len = code
  let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789' 
  let maxLen = $chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxLen ))
  }
  return pwd
}

module.exports = {
  formatTime,formatDate,randomString
}

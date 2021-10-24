const formatTime = (_date) => {
  const date = new Date(_date)
  const year = date.getFullYear() + '年'
  const month = date.getMonth() + 1 + '月'
  const day = date.getDate() + '日'
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime
}